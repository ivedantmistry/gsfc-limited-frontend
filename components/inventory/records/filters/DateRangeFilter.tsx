import React from "react";
import { DatePicker } from "@/components/ui/date-picker";

interface DateRangeFilterProps {
  dateAfter: Date | undefined;
  setDateAfter: (date: Date | undefined) => void;
  dateBefore: Date | undefined;
  setDateBefore: (date: Date | undefined) => void;
}

export function DateRangeFilter({ dateAfter, setDateAfter, dateBefore, setDateBefore }: DateRangeFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-2 flex-grow">
      <div>
        <p className="text-sm font-medium mb-1 text-muted-foreground">Start Date</p>
        <DatePicker date={dateAfter} setDate={setDateAfter} placeholder="From" />
      </div>
      <div>
        <p className="text-sm font-medium mb-1 text-muted-foreground">End Date</p>
        <DatePicker date={dateBefore} setDate={setDateBefore} placeholder="To" />
      </div>
    </div>
  );
}