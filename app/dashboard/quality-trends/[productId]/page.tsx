"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProductQualityDetail } from "@/lib/api/quality-detail";
import { RecentTestRecord } from "@/lib/types/quality-detail.types";

// UI & Charting Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QualityChart from "@/components/quality-trends/QualityChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, FileSpreadsheet } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";

// A simple component for the recent tests table
const RecentTestsTable = ({ tests }: { tests: RecentTestRecord[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Test Records</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Record ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Analyst</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.record_id}</TableCell>
              <TableCell>{test.status}</TableCell>
              <TableCell>{format(new Date(test.created_at), "PPp")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function ProductQualityDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  // State for the date range filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30), // Default to last 30 days
    to: new Date(),
  });

  // State to manage the selected grade
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);

  // Fetch data using our new hook
  const { productDetail, isLoading, error } = useProductQualityDetail(
    productId,
    dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined
  );
 const handleExport = () => {
    const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : '';
    const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : '';

    // Construct the full URL with the format=excel parameter
    const exportUrl = `/api/inventory/products/${productId}/quality-details/?start_date=${startDate}&end_date=${endDate}&format=excel`;
    
    // Open the URL in a new tab, which will trigger the browser's download prompt
    window.open(exportUrl, '_blank');
  };
  // Effect to set a default grade when the data loads
  useEffect(() => {
    if (
      productDetail?.has_grades &&
      productDetail.grades.length > 0 &&
      !selectedGradeId
    ) {
      // Default to the first grade in the list
      setSelectedGradeId(productDetail.grades[0].id);
    }
  }, [productDetail, selectedGradeId]);

  if (isLoading)
    return <p className="text-center p-8">Loading quality details...</p>;
  if (error)
    return (
      <p className="text-center p-8 text-red-500">
        Failed to load product data. It may not have an active version.
      </p>
    );
  if (!productDetail) return null;

  // Find the currently selected grade's data
  const selectedGrade = productDetail.has_grades
    ? productDetail.grades.find((g) => g.id === selectedGradeId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/quality-trends" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {productDetail.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quality analysis for active version:{" "}
          <span className="font-semibold">
            {productDetail.active_version_name}
          </span>
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Filters & Export</h2>
        </CardHeader>

        <CardContent className="pt-6 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setDateRange({ from: new Date(), to: new Date() })}
          >
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setDateRange({ from: subDays(new Date(), 7), to: new Date() })
            }
          >
            Last 7 Days
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setDateRange({ from: subDays(new Date(), 30), to: new Date() })
            }
          >
            Last 30 Days
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {productDetail.has_grades && (
            <Select
              value={selectedGradeId ? String(selectedGradeId) : ""}
              onValueChange={(value) => setSelectedGradeId(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[280px] border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900">
                <SelectValue placeholder="Select a Grade" />
              </SelectTrigger>

              <SelectContent>
                {productDetail.grades.map((grade) => (
                  <SelectItem key={grade.id} value={String(grade.id)}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={handleExport}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export as Excel
          </Button>
        </CardContent>
      </Card>

      {/* Main Chart Section */}
      <div className="space-y-8">
        {productDetail.has_grades ? (
          // Render charts for the selected grade
          selectedGrade ? (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-4 border-b pb-2">
                Grade: {selectedGrade.name}
              </h2>
              {selectedGrade.trends && selectedGrade.trends.length > 0 ? (
                <QualityChart data={selectedGrade.trends} />
              ) : (
                <p>
                  No trend data available for this grade in the selected period.
                </p>
              )}
            </div>
          ) : (
            <p className="text-center py-8">
              Please select a grade to view its trends.
            </p>
          )
        ) : (
          // Original logic for versions without grades
          <div>
            {productDetail.trends && productDetail.trends.length > 0 ? (
              <QualityChart data={productDetail.trends} />
            ) : (
              <p>No trend data available for the selected period.</p>
            )}
          </div>
        )}
      </div>

      {/* Recent Tests Table */}
      <div>
        {productDetail.recent_tests && productDetail.recent_tests.length > 0 ? (
          <RecentTestsTable tests={productDetail.recent_tests} />
        ) : (
          <p>No recent tests found for this product.</p>
        )}
      </div>
    </div>
  );
}
