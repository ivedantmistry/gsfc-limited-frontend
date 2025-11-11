// src/components/quality-trends/QualityChart.tsx
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

type ZoomStateType = {
  x1: string | null;
  x2: string | null;
};
type ZoomDomainType = {
  x: [string, string] | ["auto", "auto"];
};
type ChartEvent = {
  activeLabel?: string;
};

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

  const [zoomArea, setZoomArea] = useState<ZoomStateType>({
    x1: null,
    x2: null,
  });
  const [zoomDomain, setZoomDomain] = useState<ZoomDomainType>({
    x: ["auto", "auto"],
  });

  const handleMouseDown = (e: ChartEvent) => {
    if (e?.activeLabel) {
      setZoomArea({ ...zoomArea, x1: e.activeLabel });
    }
  };

  const handleMouseMove = (e: ChartEvent) => {
    if (zoomArea.x1 && e?.activeLabel) {
      setZoomArea({ ...zoomArea, x2: e.activeLabel });
    }
  };

  const handleMouseUp = () => {
    const { x1, x2 } = zoomArea;
    if (x1 && x2) {
      const newXDomain = [x1 < x2 ? x1 : x2, x1 > x2 ? x1 : x2] as [
        string,
        string
      ];
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
              domain={zoomDomain.x}
              allowDataOverflow
              type="category"
              tickFormatter={(dateStr) =>
                format(new Date(`${dateStr}T00:00:00`), "MMM dd")
              }
            />
            <YAxis
              domain={["auto", "auto"]}
              allowDataOverflow
              type="number"
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              labelFormatter={(label) =>
                format(new Date(`${label}T00:00:00`), "PP")
              }
              formatter={(value, name) => {
                if (
                  Array.isArray(value) &&
                  typeof value[0] === "number" &&
                  typeof value[1] === "number"
                ) {
                  return [
                    `${value[0].toFixed(2)} - ${value[1].toFixed(2)}`,
                    " Daily Range",
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
