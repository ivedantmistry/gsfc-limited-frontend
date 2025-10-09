"use client";

import React, { useState } from "react";
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
  ReferenceArea,
} from "recharts";
import { AggregatedTrend } from "@/lib/types/dashboard.types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomOut } from "lucide-react";

// The main component that maps over the data
export default function QualityChart({ data }: { data: AggregatedTrend[] }) {
  if (!data || data.length === 0) {
    return <p>No data available to display.</p>;
  }
  return (
    <div className="space-y-6">
      {data.map((parameterData) => (
        <ChartForParameter
          key={parameterData.id}
          parameterData={parameterData}
        />
      ))}
    </div>
  );
}

// A stateful component for an individual chart with zoom capabilities
const ChartForParameter = ({
  parameterData,
}: {
  parameterData: AggregatedTrend;
}) => {
  const chartData = parameterData.data_points;
  const yAxisLabel = parameterData.unit
    ? `Value (${parameterData.unit})`
    : "Value";
  const minSpec = parameterData.min_value
    ? parseFloat(parameterData.min_value)
    : null;
  const maxSpec = parameterData.max_value
    ? parseFloat(parameterData.max_value)
    : null;

  // State to manage the zoom selection area
  const [zoomArea, setZoomArea] = useState<{ x1: any; x2: any }>({
    x1: null,
    x2: null,
  });
  // State to hold the final zoomed-in domain for the axes
  const [zoomDomain, setZoomDomain] = useState({
    x: ["auto" as const, "auto" as const],
  });

  const handleMouseDown = (e: any) => {
    if (e?.activeLabel) {
      setZoomArea({ ...zoomArea, x1: e.activeLabel });
    }
  };

  const handleMouseMove = (e: any) => {
    if (zoomArea.x1 && e?.activeLabel) {
      setZoomArea({ ...zoomArea, x2: e.activeLabel });
    }
  };

  const handleMouseUp = () => {
    const { x1, x2 } = zoomArea;
    if (x1 && x2) {
      const newXDomain = [x1 < x2 ? x1 : x2, x1 > x2 ? x1 : x2] as [any, any];
      if (newXDomain[0] !== newXDomain[1]) {
        setZoomDomain({ x: newXDomain });
      }
    }
    // Reset the selection area
    setZoomArea({ x1: null, x2: null });
  };

  const resetZoom = () => {
    setZoomDomain({ x: ["auto", "auto"] });
  };

  const isZoomed = zoomDomain.x[0] !== "auto";

  // ✅ 1. Create the formatted title string with the spec range
  const specRange =
    minSpec !== null && maxSpec !== null
      ? `(${minSpec.toFixed(2)} - ${maxSpec.toFixed(2)})`
      : `(No Spec)`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {`${parameterData.name} Trend `}
          <span className="text-sm font-normal text-slate-500">
            {specRange}
          </span>
        </CardTitle>
        {isZoomed && (
          <Button variant="outline" size="sm" onClick={resetZoom}>
            <ZoomOut className="mr-2 h-4 w-4" />
            Reset Zoom
          </Button>
        )}
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              domain={zoomDomain.x} // Apply the zoom domain
              allowDataOverflow
              type="category"
              tickFormatter={(dateStr) => format(new Date(dateStr), "MMM dd")}
            />
            <YAxis
              domain={["auto", "auto"]} // Let Y-axis auto-adjust to the visible data
              allowDataOverflow
              type="number"
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              labelFormatter={(label) => format(new Date(label), "PPpp")}
              formatter={(value, name) => {
                if (
                  Array.isArray(value) &&
                  typeof value[0] === "number" &&
                  typeof value[1] === "number"
                ) {
                  return [
                    `${value[0].toFixed(2)} - ${value[1].toFixed(2)}`,
                    "Range",
                  ];
                }
                if (typeof value === "number") {
                  return [value.toFixed(2), name];
                }
                return [value, name];
              }}
            />
            <Legend />

            {minSpec !== null && (
              <ReferenceLine y={minSpec} stroke="red" strokeDasharray="3 3" />
            )}
            {maxSpec !== null && (
              <ReferenceLine y={maxSpec} stroke="red" strokeDasharray="3 3" />
            )}

            <Area
              type="monotone"
              dataKey={(p) => [p.min, p.max]}
              fill="#e0e7ff"
              name="Daily Range"
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#4f46e5"
              name="Daily Avg"
              strokeWidth={2}
              dot={false}
            />

            {/* The ReferenceArea for selecting zoom on the X-axis */}
            {zoomArea.x1 && zoomArea.x2 && (
              <ReferenceArea
                x1={zoomArea.x1}
                x2={zoomArea.x2}
                strokeOpacity={0.3}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
