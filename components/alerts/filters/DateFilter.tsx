// src/components/shared/filters/DateFilter.tsx

"use client";

import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { DatePresetButtons, DateRange } from "./DatePresetButtons";

interface DateFilterProps {
  dateAfter: Date | undefined;
  setDateAfter: (date: Date | undefined) => void;
  dateBefore: Date | undefined;
  setDateBefore: (date: Date | undefined) => void;
}

export default function DateFilter({
  dateAfter,
  setDateAfter,
  dateBefore,
  setDateBefore,
}: DateFilterProps) {
  const handlePresetSelect = (range: DateRange) => {
    setDateAfter(range.from);
    setDateBefore(range.to);
  };

  return (
    <div className="p-4 border bg-card rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-4">
      <DatePresetButtons onPresetSelect={handlePresetSelect} />
      <div className="flex items-center gap-2">
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">From</p>
          <DatePicker
            date={dateAfter}
            setDate={setDateAfter}
            placeholder="Start date"
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">To</p>
          <DatePicker
            date={dateBefore}
            setDate={setDateBefore}
            placeholder="End date"
          />
        </div>
      </div>
    </div>
  );
}
