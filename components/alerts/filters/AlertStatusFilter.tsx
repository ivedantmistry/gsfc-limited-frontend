// src/components/alerts/filters/AlertStatusFilter.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALERT_STATUS_OPTIONS = ["NEW", "ACKNOWLEDGED", "RESOLVED"] as const;

interface AlertStatusFilterProps {
  status: string;
  setStatus: (value: string) => void;
}

export function AlertStatusFilter({
  status,
  setStatus,
}: AlertStatusFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        Status
      </label>
      <Select
        value={status || "all"}
        onValueChange={(val) => setStatus(val === "all" ? "" : val)}
      >
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {ALERT_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
