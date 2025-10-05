// src/components/admin/UserPerformanceChart.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useUserPerformanceChart, useUserSummaryCounts } from "@/lib/api/users";
import { useUserProfile } from "@/context/UserProfileContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { Loader2 } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/ui/date-picker";

const timeRangeOptions = [
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "3_months", label: "Last 3 Months" },
  { value: "6_months", label: "Last 6 Months" },
  { value: "year", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
];

export default function UserPerformanceChart() {
  const { userId } = useUserProfile();
  const [timeRange, setTimeRange] = useState("week");
  const [customDateRange, setCustomDateRange] = useState<
    DateRange | undefined
  >();

  const dateAfter = customDateRange?.from
    ? format(startOfDay(customDateRange.from), "yyyy-MM-dd")
    : undefined;
  const dateBefore = customDateRange?.to
    ? format(startOfDay(customDateRange.to), "yyyy-MM-dd")
    : undefined;

  const { data: summaryData, isLoading: isLoadingSummary } =
    useUserSummaryCounts(
      userId,
      timeRange === "custom" ? dateAfter : undefined,
      timeRange === "custom" ? dateBefore : undefined
    );

  const chartParams = useMemo(() => {
    if (timeRange === "custom") {
      return {
        group_by: "day" as const,
        date_after: dateAfter,
        date_before: dateBefore,
      };
    }
     switch (timeRange) {
      case "week": // Last 7 Days
        return { group_by: "day" as const };

      // ✅ FIX: Change this case to group by 'day' instead of 'week'
      case "month": // Last 30 Days
        return { group_by: "day" as const };

      case "3_months": // Last 3 Months
        return { group_by: "week" as const };
        
      default: // 6 months or 1 year
        return { group_by: "month" as const };
    }
  }, [timeRange, dateAfter, dateBefore]);

  const { data: chartData, isLoading: isLoadingChart } =
    useUserPerformanceChart(userId, chartParams);

  const displayCount = useMemo(() => {
    if (!summaryData) return 0;
    if (timeRange === "custom") {
      return summaryData.count_custom ?? 0;
    }
    switch (timeRange) {
      case "week":
        return summaryData.count_week;
      case "month":
        return summaryData.count_month;
      case "3_months":
        return summaryData.count_3_months;
      case "6_months":
        return summaryData.count_6_months;
      case "year":
        return summaryData.count_year;
      default:
        return 0;
    }
  }, [timeRange, summaryData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Number of test records created over time.
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingSummary ? (
          <div className="flex justify-center items-center h-[350px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold">
              {displayCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Total records in the last selected period
            </p>
            {timeRange === "custom" && (
              <div className="grid grid-cols-2 gap-4 my-4">
                <DatePicker
                  date={customDateRange?.from}
                  // ✅ FIX: Explicitly construct the DateRange object
                  setDate={(date) =>
                    setCustomDateRange((prev) => ({ from: date, to: prev?.to }))
                  }
                  placeholder="From Date"
                />
                <DatePicker
                  date={customDateRange?.to}
                  // ✅ FIX: Explicitly construct the DateRange object
                  setDate={(date) =>
                    setCustomDateRange((prev) => ({ from: prev?.from, to: date }))
                  }
                  placeholder="To Date"
                />
              </div>
            )}
            <div className="h-[250px]">
              {isLoadingChart ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(str) => format(new Date(str), "MMM d")}
                      stroke="#888888"
                      fontSize={12}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="#888888"
                      fontSize={12}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
