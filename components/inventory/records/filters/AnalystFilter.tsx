import React, { useMemo } from "react";
import { useUsers } from "@/lib/api/users";
import { User } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalystFilterProps {
  analystId: string | null;
  setAnalystId: (value: string | null) => void;
}

export function AnalystFilter({ analystId, setAnalystId }: AnalystFilterProps) {
  const { users, isLoading: isLoadingUsers } = useUsers(1, 200);

  const analysts = useMemo(() => {
    return users?.filter((user) => user.all_permissions?.includes("inventory.add_testrecord")) || [];
  }, [users]);

  const getAnalystDisplayName = (analyst: User) => {
    const fullName = `${analyst.first_name} ${analyst.last_name}`.trim();
    return fullName || analyst.username;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">Analyst</label>
      <Select value={analystId ?? "all"} onValueChange={(val) => setAnalystId(val === "all" ? null : val)} disabled={isLoadingUsers}>
        <SelectTrigger className="h-10 w-full"><SelectValue placeholder="All Analysts" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Analysts</SelectItem>
          {analysts.map((analyst) => <SelectItem key={analyst.id} value={String(analyst.id)}>{getAnalystDisplayName(analyst)}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}