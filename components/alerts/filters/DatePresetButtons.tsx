// src/components/inventory/records/filters/DatePresetButtons.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DatePresetButtonsProps {
  onPresetSelect: (range: DateRange) => void;
}

const PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", months: 3 },
  { label: "Last 6 months", months: 6 },
  { label: "Last year", years: 1 },
];

export function DatePresetButtons({ onPresetSelect }: DatePresetButtonsProps) {
  const handleSelect = (preset: typeof PRESETS[0]) => {
    const to = endOfDay(new Date());
    let from;

    if (preset.days) from = startOfDay(subDays(to, preset.days - 1));
    else if (preset.months) from = startOfDay(subMonths(to, preset.months));
    else if (preset.years) from = startOfDay(subYears(to, preset.years));

    if (from) onPresetSelect({ from, to });
  };

  return (
    // ✅ FIX: Changed back to a horizontal, wrapping flex row
    <div className="flex items-center gap-2 flex-wrap">
      {PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          size="sm"
          className="text-muted-foreground"
          onClick={() => handleSelect(preset)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}