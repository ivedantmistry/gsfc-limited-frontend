import React from "react";
import { useLabs } from "@/lib/api/lab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LabFilterProps {
  labId: string | null;
  setLabId: (value: string | null) => void;
}

export function LabFilter({ labId, setLabId }: LabFilterProps) {
  const { labs, isLoading: isLoadingLabs } = useLabs();

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">Lab</label>
      <Select value={labId ?? "all"} onValueChange={(val) => setLabId(val === "all" ? null : val)} disabled={isLoadingLabs}>
        <SelectTrigger className="h-10 w-full"><SelectValue placeholder="All Labs" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Labs</SelectItem>
          {labs?.map((lab) => <SelectItem key={lab.id} value={String(lab.id)}>{lab.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}