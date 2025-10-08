// app/dashboard/quality-trends/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProductHealthDashboard } from "@/lib/api/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AggregatedDataPoint } from "@/lib/types/dashboard.types"; // ✅ 1. Import the new type

const MiniChart = ({
  data,
  parameterName,
}: {
  data: AggregatedDataPoint[];
  parameterName: string;
}) => {
  const allValues = data.flatMap((d) => [d.min, d.max]);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);

  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
      >
        <Tooltip
          contentStyle={{ fontSize: "0.75rem", padding: "2px 8px" }}
          labelFormatter={(label) => format(new Date(label), "MMM dd")}
          // ✅ 2. Fix the formatter to handle numbers correctly and prevent type errors
          formatter={(value, name) => {
            if (
              Array.isArray(value) &&
              typeof value[0] === "number" &&
              typeof value[1] === "number"
            ) {
              // This now shows the actual range as you requested!
              return [`${value[0].toFixed(2)} - ${value[1].toFixed(2)}`, name];
            }
            if (typeof value === "number") {
              return [value.toFixed(2), name];
            }
            return [value, name];
          }}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(dateStr) => format(new Date(dateStr), "MMM dd")}
          fontSize="0.75rem"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[
            dataMin - (dataMax - dataMin) * 0.1,
            dataMax + (dataMax - dataMin) * 0.1,
          ]}
          fontSize="0.75rem"
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tickFormatter={(value) => Math.round(value).toString()}
        />
        <Area
          type="monotone"
          dataKey={(payload) => [payload.min, payload.max]}
          stroke="#a5b4fc"
          fill="#e0e7ff"
          fillOpacity={0.6}
          name="Daily Range" // This label is now mainly for the legend if we add one
        />
        <Line
          type="monotone"
          dataKey="avg"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={false}
          name="Daily Avg"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default function QualityTrendsHubPage() {
  const [includeOutliers, setIncludeOutliers] = useState(true);
  // ✅ 3. Fix the hook call by passing the 'includeOutliers' argument
  const { dashboardData, isLoading, error } =
    useProductHealthDashboard(includeOutliers);

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p>Failed to load dashboard data.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Product Health Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time quality overview of active product versions.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-outliers"
              checked={includeOutliers}
              onCheckedChange={(checked) =>
                setIncludeOutliers(checked as boolean)
              }
            />
            <Label htmlFor="include-outliers" className="text-sm font-medium">
              Include Out-of-Spec Results
            </Label>
          </div>
          <Link href="/dashboard/quality-trends/report" passHref>
            <Button>
              Detailed Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboardData?.map((product) => (
          <Link
            key={product.product_id}
            href={`/dashboard/quality-trends/report?product=${product.product_id}&version=${product.active_version_id}`}
            passHref
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{product.product_name}</CardTitle>
                <CardDescription>
                  Active Version: {product.active_version_name}
                  {product.last_updated_at && (
                    <span className="block text-xs">
                      Last Closed Record:{" "}
                      {formatDistanceToNow(new Date(product.last_updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.trends.map((trend) => (
                  <div key={trend.id}>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      {trend.name}
                    </h4>
                    {/* ✅ 4. The data mapping is now correctly typed and requires no changes */}
                    <MiniChart
                      parameterName={trend.name}
                      data={trend.data_points.map((dp) => ({
                        date: dp.date,
                        avg: dp.avg, // No parseFloat needed if types are correct
                        min: dp.min,
                        max: dp.max,
                      }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
