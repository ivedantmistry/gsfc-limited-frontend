"use client";

import React, { useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
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

  // Fetch data using our new hook
  const { productDetail, isLoading, error } = useProductQualityDetail(
    productId,
    dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined
  );

  if (isLoading)
    return <p className="text-center p-8">Loading quality details...</p>;
  if (error)
    return (
      <p className="text-center p-8 text-red-500">
        Failed to load product data. It may not have an active version.
      </p>
    );
  if (!productDetail) return null;

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
        <CardContent className="pt-6 flex items-center gap-2">
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
                className="w-[280px] justify-start text-left font-normal"
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
        </CardContent>
      </Card>

      {/* Main Chart Section */}
      <div className="space-y-8">
        {productDetail.has_grades ? (
          // Render charts grouped by grade
          productDetail.grades.map((grade) => (
            <div key={grade.id}>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-4 border-b pb-2">
                Grade: {grade.name}
              </h2>
              {grade.trends && grade.trends.length > 0 ? (
                <QualityChart data={grade.trends} />
              ) : (
                <p>
                  No trend data available for this grade in the selected period.
                </p>
              )}
            </div>
          ))
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
