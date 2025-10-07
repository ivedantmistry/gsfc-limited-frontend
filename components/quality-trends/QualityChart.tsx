// src/components/charts/QualityChart.tsx
"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { QualityTrend } from "@/lib/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityChartProps {
  data: QualityTrend[];
}

export default function QualityChart({ data }: QualityChartProps) {
  if (!data || data.length === 0) {
    return <p>No data available to display.</p>;
  }

  // A color palette for the lines if you plot multiple on one chart later
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

  return (
    <div className="space-y-6">
      {data.map((parameterData, index) => {
        // Prepare data points: parse string values to numbers for plotting
        const chartData = parameterData.data_points.map((dp) => ({
          ...dp,
          value: parseFloat(dp.value), // Convert string value to a number
        }));

        const yAxisLabel = parameterData.unit
          ? `Value (${parameterData.unit})`
          : "Value";

        return (
          <Card key={parameterData.id}>
            <CardHeader>
              <CardTitle>{parameterData.name} Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(dateStr) =>
                      format(new Date(dateStr), "MMM dd")
                    }
                    name="Date"
                  />
                  <YAxis
                    label={{
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    labelFormatter={(label) => format(new Date(label), "PPpp")}
                    formatter={(value: number) => [value, parameterData.name]}
                  />
                  <Legend />

                  {/* Tolerance Lines for Min/Max Values */}
                  {parameterData.min_value && (
                    <ReferenceLine
                      y={parseFloat(parameterData.min_value)}
                      label="Min Spec"
                      stroke="red"
                      strokeDasharray="3 3"
                    />
                  )}
                  {parameterData.max_value && (
                    <ReferenceLine
                      y={parseFloat(parameterData.max_value)}
                      label="Max Spec"
                      stroke="red"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Main Data Line */}
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={parameterData.name}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
