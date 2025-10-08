// src/components/charts/QualityChart.tsx
"use client";

import React from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
} from "recharts";
import { AggregatedTrend } from "@/lib/types/dashboard.types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomDot = (props: any) => {
  const { cx, cy, payload, minSpec, maxSpec } = props;
  const { avg } = payload;

  const isOutOfSpec = (minSpec && avg < minSpec) || (maxSpec && avg > maxSpec);

  if (isOutOfSpec) {
    return <Dot cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#fff" strokeWidth={2} />;
  }
  return null;
};

interface QualityChartProps {
  data: AggregatedTrend[];
}

export default function QualityChart({ data }: QualityChartProps) {
  if (!data || data.length === 0) {
    return <p>No data available to display.</p>;
  }

  return (
    <div className="space-y-6">
      {data.map((parameterData) => {
        const chartData = parameterData.data_points;
        const yAxisLabel = parameterData.unit ? `Value (${parameterData.unit})` : "Value";
        const minSpec = parameterData.min_value ? parseFloat(parameterData.min_value) : null;
        const maxSpec = parameterData.max_value ? parseFloat(parameterData.max_value) : null;

        return (
          <Card key={parameterData.id}>
            <CardHeader>
              <CardTitle>{parameterData.name} Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(dateStr) => format(new Date(dateStr), "MMM dd")}
                    name="Date"
                  />
                  <YAxis
                    label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
                    domain={['auto', 'auto']}
                    allowDataOverflow
                  />
                  <Tooltip
                    labelFormatter={(label) => format(new Date(label), "PPpp")}
                    formatter={(value, name) => {
                      if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
                        return [`${value[0].toFixed(2)} - ${value[1].toFixed(2)}`, name];
                      }
                      if (typeof value === "number") {
                        return [value.toFixed(2), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />

                  {minSpec !== null && (
                    <ReferenceLine y={minSpec} label="Min Spec" stroke="red" strokeDasharray="3 3" />
                  )}
                  {maxSpec !== null && (
                    <ReferenceLine y={maxSpec} label="Max Spec" stroke="red" strokeDasharray="3 3" />
                  )}
                  
                  <Area
                    type="monotone"
                    dataKey={(payload) => [payload.min, payload.max]}
                    stroke="#a5b4fc" fill="#e0e7ff" fillOpacity={0.6} name="Daily Range"
                  />

                  <Line
                    type="monotone"
                    dataKey="avg"
                    name="Daily Avg"
                    stroke="#4f46e5" // Always use indigo for the line
                    strokeWidth={2}
                    dot={<CustomDot minSpec={minSpec} maxSpec={maxSpec} />}
                    activeDot={{ r: 8, fill: '#4f46e5' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}