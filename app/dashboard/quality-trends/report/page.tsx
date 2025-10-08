// app/dashboard/quality-trends/page.tsx
"use client";

import React, { useState, useEffect } from "react";
// ✅ 1. Import hooks for URL management from Next.js
import { useRouter, useSearchParams } from "next/navigation";

// Your existing API and type imports
import { useAllProducts } from "@/lib/api/product";
import {
  useVersions,
  useVersion,
  useActiveVersionForProduct,
} from "@/lib/api/version";
import { useQualityTrends } from "@/lib/api/stats";
import {
  ParameterDefinition,
  Product,
  Version,
  ProductGrade,
} from "@/lib/types";

// UI Components
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
import { format, parseISO } from "date-fns";
import QualityChart from "@/components/quality-trends/QualityChart";

export default function QualityTrendsPage() {
  // ✅ 2. Initialize router and search params
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ 3. Read initial filter state directly from the URL's query parameters
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    searchParams.get("product") ? Number(searchParams.get("product")) : null
  );
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    searchParams.get("version") ? Number(searchParams.get("version")) : null
  );
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(
    searchParams.get("grade") ? Number(searchParams.get("grade")) : null
  );
  const [selectedParameterIds, setSelectedParameterIds] = useState<number[]>(
    searchParams.get("params")
      ? searchParams.get("params")!.split(",").map(Number)
      : []
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get("from")
      ? parseISO(searchParams.get("from")!)
      : new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: searchParams.get("to") ? parseISO(searchParams.get("to")!) : new Date(),
  });

  const [availableParams, setAvailableParams] = useState<ParameterDefinition[]>(
    []
  );

  // SWR Hooks for fetching filter options and data
  const { products, isLoading: isLoadingProducts } = useAllProducts();
  const { versions } = useVersions(selectedProductId || "");
  const { version } = useVersion(selectedVersionId||"");
  const { activeVersion, isLoading: isLoadingActiveVersion } =
    useActiveVersionForProduct(selectedProductId);

  // The useQualityTrends hook now directly uses the state derived from the URL
  const {
    data: trendData,
    isLoading: isLoadingTrends,
    error,
  } = useQualityTrends({
    versionId: selectedVersionId,
    parameterIds: selectedParameterIds,
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : null,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : null,
  });

  // ✅ 4. Effect to set a DEFAULT view if no product is selected in the URL
  useEffect(() => {
    // Wait for products to load and ensure no product is already selected
    if (!isLoadingProducts && products && !selectedProductId) {
      // Default to the first product in the list
      const defaultProduct = products[0];
      if (defaultProduct) {
        setSelectedProductId(defaultProduct.id);
      }
    }
  }, [products, isLoadingProducts, selectedProductId]);

  useEffect(() => {
    // After a default product is set, find its active version
    if (
      selectedProductId &&
      !selectedVersionId &&
      !isLoadingActiveVersion &&
      activeVersion
    ) {
      setSelectedVersionId(activeVersion.id);
    }
  }, [
    selectedProductId,
    selectedVersionId,
    activeVersion,
    isLoadingActiveVersion,
  ]);

  // ✅ 5. Effect to SYNC the component's state back to the URL's query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedProductId) params.set("product", String(selectedProductId));
    if (selectedVersionId) params.set("version", String(selectedVersionId));
    if (selectedGradeId) params.set("grade", String(selectedGradeId));
    if (selectedParameterIds.length > 0)
      params.set("params", selectedParameterIds.join(","));
    if (dateRange?.from)
      params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"));

    // Use router.replace to update the URL without adding to browser history
    router.replace(`/dashboard/quality-trends?${params.toString()}`);
  }, [
    selectedProductId,
    selectedVersionId,
    selectedGradeId,
    selectedParameterIds,
    dateRange,
    router,
  ]);

  // Effect to update available parameters (logic is unchanged)
  useEffect(() => {
    if (!version) {
      setAvailableParams([]);
      return;
    }
    if (version.grades && version.grades.length > 0) {
      if (selectedGradeId) {
        const selectedGrade = version.grades.find(
          (g) => g.id === selectedGradeId
        );
        setAvailableParams(selectedGrade?.parameters || []);
      } else {
        setAvailableParams([]);
      }
    } else if (version.parameters) {
      setAvailableParams(version.parameters);
    } else {
      setAvailableParams([]);
    }
  }, [version, selectedGradeId]);

  // Handlers now just update state. The useEffect above will handle the URL.
  const handleProductChange = (productId: string) => {
    setSelectedProductId(Number(productId));
    setSelectedVersionId(null);
    setSelectedGradeId(null);
    setSelectedParameterIds([]);
  };
  const handleVersionChange = (versionId: string) => {
    setSelectedVersionId(Number(versionId));
    setSelectedGradeId(null);
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

  const hasGrades = version && version.grades && version.grades.length > 0;

  // Determine the main loading state
  const isPageLoading =
    isLoadingProducts || (selectedProductId && !version && !versions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Quality Trends Analysis
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Visualize parameter trends over time for any product version.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            onValueChange={handleProductChange}
            value={selectedProductId ? String(selectedProductId) : ""}
          >
            <SelectTrigger disabled={isLoadingProducts}>
              <SelectValue placeholder="Select a Product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleVersionChange}
            disabled={!selectedProductId}
            value={selectedVersionId ? String(selectedVersionId) : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Version" />
            </SelectTrigger>
            <SelectContent>
              {versions?.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.version_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasGrades && (
            <Select
              onValueChange={handleGradeChange}
              disabled={!selectedVersionId}
              value={selectedGradeId ? String(selectedGradeId) : ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {version?.grades.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "LLL dd, y")} - ${format(
                      dateRange.to,
                      "LLL dd, y"
                    )}`
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

      {availableParams.length > 0 && (
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

      <div className="mt-6">
        {isLoadingTrends && (
          <p className="text-center py-12 text-slate-500">
            Loading chart data...
          </p>
        )}
        {error && (
          <p className="text-red-500">Failed to load data. Please try again.</p>
        )}
        {trendData && trendData.length > 0 && <QualityChart data={trendData} />}
        {trendData && trendData.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No test results found for the selected criteria.</p>
          </div>
        )}
        {!trendData && !isLoadingTrends && !error && !isPageLoading && (
          <div className="text-center py-12 text-slate-500">
            <p>Please select parameters to view trends.</p>
          </div>
        )}
      </div>
    </div>
  );
}
