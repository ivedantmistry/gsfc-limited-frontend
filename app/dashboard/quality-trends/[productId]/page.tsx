"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProductQualityDetail } from "@/lib/api/quality-detail";
import { RecentTestRecord } from "@/lib/types/quality-detail.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
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
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  Copy,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 👇 REPLACE the old RecentTestsTable with this new version
const RecentTestsTable = ({ tests }: { tests: RecentTestRecord[] }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, recordId: string) => {
    navigator.clipboard.writeText(recordId).then(
      () => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000); // Reset feedback after 2s
      },
      (err) => {
        console.error("Could not copy text: ", err); // Error handling
      }
    );
  };

  return (
    <TooltipProvider>
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
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{test.record_id}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              handleCopy(String(test.id), test.record_id)
                            }
                          >
                            {copiedId === String(test.id) ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {copiedId === String(test.id)
                              ? "Copied!"
                              : "Copy ID"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>{test.status}</TableCell>
                  <TableCell>
                    {format(new Date(test.created_at), "PPp")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

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
  const [isExporting, setIsExporting] = useState(false);
  // Fetch data using our new hook
  const { productDetail, isLoading, error } = useProductQualityDetail(
    productId,
    dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined
  );
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const startDate = dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : "";
      const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

      // The relative path for the API call
      const url = `inventory/products/${productId}/quality-details/?start_date=${startDate}&end_date=${endDate}&format=excel`;

      // Use the 'api' client to make an authenticated request for the file
      const response = await api.get(url, {
        responseType: "blob", // Important: tells axios to expect binary data
      });

      // Create a URL for the blob data
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = fileURL;

      // Extract filename from the 'Content-Disposition' header sent by the backend
      const contentDisposition = response.headers["content-disposition"];
      let filename = "quality-report.xlsx"; // a default filename
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute("download", filename);

      // Append to the document, click, and then remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL); // Clean up the blob URL
    } catch (err) {
      console.error("Export failed", err);
      // You can add a user-facing error message here (e.g., using toast)
    } finally {
      setIsExporting(false);
    }
  };
  useEffect(() => {
    if (
      productDetail?.has_grades &&
      productDetail.grades.length > 0 &&
      !selectedGradeId
    ) {
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

  const selectedGrade = productDetail.has_grades
    ? productDetail.grades.find((g) => g.id === selectedGradeId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/quality-trends" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Products
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
          {/* <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : "Export as Excel"}
          </Button> */}
        </CardContent>
      </Card>

      <div className="space-y-8">
        {productDetail.has_grades ? (
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
          <div>
            {productDetail.trends && productDetail.trends.length > 0 ? (
              <QualityChart data={productDetail.trends} />
            ) : (
              <p>No trend data available for the selected period.</p>
            )}
          </div>
        )}
      </div>

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
