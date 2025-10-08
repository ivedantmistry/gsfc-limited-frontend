// app/dashboard/quality-trends/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAllProducts } from "@/lib/api/product";
import { useQualityTrends } from "@/lib/api/stats";
import {
  ParameterDefinition,
  Product,
  Version,
  ProductGrade,
} from "@/lib/types";
import { useVersions, useVersion } from "@/lib/api/version";
import QualityChart from "@/components/quality-trends/QualityChart";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, LineChart } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function QualityTrendsPage() {
  // State for user selections
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null
  );
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);

  const [availableParams, setAvailableParams] = useState<ParameterDefinition[]>(
    []
  );
  const [selectedParameterIds, setSelectedParameterIds] = useState<number[]>(
    []
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // State to trigger the final API call
  const [fetchParams, setFetchParams] = useState<{
    versionId: number | null;
    parameterIds: number[];
    startDate: string | null;
    endDate: string | null;
  }>({ versionId: null, parameterIds: [], startDate: null, endDate: null });

  // SWR Hooks to fetch filter data
  const { products } = useAllProducts();
  const { versions } = useVersions(selectedProductId || "");
  const { version } = useVersion(selectedVersionId || "");

  // ✅ 2. Revamped useEffect to handle both grades and direct parameters
  useEffect(() => {
    if (!version) {
      setAvailableParams([]);
      return;
    }

    // Case 1: The selected version has grades
    if (version.grades && version.grades.length > 0) {
      if (selectedGradeId) {
        const selectedGrade = version.grades.find(
          (g) => g.id === selectedGradeId
        );
        setAvailableParams(selectedGrade?.parameters || []);
      } else {
        // If no grade is selected yet, there are no parameters to show
        setAvailableParams([]);
      }
    }
    // Case 2: The version has direct parameters
    else if (version.parameters) {
      setAvailableParams(version.parameters);
    }
    // Case 3: No parameters found
    else {
      setAvailableParams([]);
    }
  }, [version, selectedGradeId]); // This effect runs whenever the 'version' object from SWR changes

  // Main SWR hook for fetching graph data
  const { data: trendData, isLoading, error } = useQualityTrends(fetchParams);

  const handleProductChange = (productId: string) => {
    setSelectedProductId(Number(productId));
    setSelectedVersionId(null);
    setSelectedGradeId(null);
    setSelectedParameterIds([]);
  };

  const handleVersionChange = (versionId: string) => {
    setSelectedVersionId(Number(versionId));
    setSelectedParameterIds([]);
  };
  const handleGradeChange = (gradeId: string) => {
    setSelectedGradeId(Number(gradeId));
    setSelectedParameterIds([]);
  };
  const handleParameterToggle = (paramId: number) => {
    setSelectedParameterIds((prev) =>
      prev.includes(paramId)
        ? prev.filter((id) => id !== paramId)
        : [...prev, paramId]
    );
  };

  const handleGenerateReport = () => {
    setFetchParams({
      versionId: selectedVersionId,
      parameterIds: selectedParameterIds,
      startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : null,
      endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : null,
    });
  };
  const hasGrades = version && version.grades && version.grades.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Quality Trends Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Visualize parameter trends over time for any product version.
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          {/* Product Select */}
          <Select onValueChange={handleProductChange}>
            <SelectTrigger>
              <SelectValue placeholder="1. Select a Product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((p: Product) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Version Select */}
          <Select
            onValueChange={handleVersionChange}
            disabled={!selectedProductId || !versions}
            value={selectedVersionId ? String(selectedVersionId) : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="2. Select a Version" />
            </SelectTrigger>
            <SelectContent>
              {versions?.map((v: Version) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.version_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ✅ 4. Conditionally render the Grade dropdown */}
          {hasGrades && (
            <Select
              onValueChange={handleGradeChange}
              disabled={!selectedVersionId}
              value={selectedGradeId ? String(selectedGradeId) : ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="3. Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {version?.grades.map((g: ProductGrade) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full md:w-auto justify-start text-left font-normal"
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

          <Button
            onClick={handleGenerateReport}
            disabled={
              !selectedVersionId ||
              selectedParameterIds.length === 0 ||
              !dateRange?.from ||
              !dateRange?.to
            }
          >
            <LineChart className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Parameter Selection */}
      {selectedVersionId && availableParams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Parameters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availableParams.map((param) => (
              <div key={param.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`param-${param.id}`}
                  checked={selectedParameterIds.includes(param.id)}
                  onCheckedChange={() => handleParameterToggle(param.id)}
                />
                <label
                  htmlFor={`param-${param.id}`}
                  className="text-sm font-medium leading-none"
                >
                  {param.name}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chart Display Area */}
      <div className="mt-6">
        {isLoading && <p>Loading chart data...</p>}
        {error && (
          <p className="text-red-500">Failed to load data. Please try again.</p>
        )}

        {/* ✅ 2. USE THE REAL CHART COMPONENT HERE */}
        {trendData && trendData.length > 0 && <QualityChart data={trendData} />}

        {/* Handle case where data is an empty array */}
        {trendData && trendData.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No test results found for the selected criteria.</p>
          </div>
        )}

        {!trendData && !isLoading && !error && (
          <div className="text-center py-12 text-slate-500">
            <p>
              Please select your filters and click "Generate Report" to view
              trends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
