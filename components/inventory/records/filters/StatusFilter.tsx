import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "CLOSED", "RETEST_ORDERED"] as const;

interface StatusFilterProps {
  status: string;
  setStatus: (value: string) => void;
}

export function StatusFilter({ status, setStatus }: StatusFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
      <Select value={status || "all"} onValueChange={(val) => setStatus(val === "all" ? "" : val)}>
        <SelectTrigger className="h-10 w-full"><SelectValue placeholder="All Statuses" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUS_OPTIONS.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}