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
import { format } from "date-fns";

// Define the options for the dropdown
const timeRangeOptions = [
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "3_months", label: "Last 3 Months" },
  { value: "6_months", label: "Last 6 Months" },
  { value: "year", label: "Last Year" },
];

export default function UserPerformanceChart() {
  // Get the userId from the context provided by the layout
  const { userId } = useUserProfile();

  // State for the dropdown selection
  const [timeRange, setTimeRange] = useState("week");

  // Fetch the summary counts once. This data is static.
  const { data: summaryData, isLoading: isLoadingSummary } =
    useUserSummaryCounts(userId);

  // Derive the parameters for the chart data hook based on the dropdown
  const chartParams = useMemo(() => {
    switch (timeRange) {
      case "week":
        return { group_by: "day" as const };
      case "month":
      case "3_months":
        return { group_by: "week" as const };
      default:
        return { group_by: "month" as const };
    }
  }, [timeRange]);

  // Fetch the chart data. SWR will re-fetch when `chartParams` changes.
  const { data: chartData, isLoading: isLoadingChart } =
    useUserPerformanceChart(userId, chartParams);

  // Derive the total count to display based on the selected time range
  const displayCount = useMemo(() => {
    if (!summaryData) return 0;
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
