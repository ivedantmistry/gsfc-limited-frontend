import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SORT_OPTIONS = [{ value: "-created_at", label: "Date (Newest First)" }, { value: "created_at", label: "Date (Oldest First)" }];

interface SortByFilterProps {
  ordering: string | null;
  setOrdering: (value: string | null) => void;
}

export function SortByFilter({ ordering, setOrdering }: SortByFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
      <Select value={ordering ?? "all"} onValueChange={(val) => setOrdering(val === "all" ? null : val)}>
        <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Default" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Default (Newest First)</SelectItem>
          {SORT_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}