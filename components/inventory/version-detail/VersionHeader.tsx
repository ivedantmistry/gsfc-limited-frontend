import React from "react";
import { VersionNested } from "@/lib/types";
import { Lock, Unlock, ShieldCheck } from "lucide-react";

interface VersionHeaderProps {
  version: VersionNested;
  isDraft: boolean;
  onAddGrade: () => void;
  onAddParameter: () => void;
}

export const VersionHeader = ({
  version,
  isDraft,
}: VersionHeaderProps) => (
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Manage Version: {version.version_name}
      </h1>
      <div className="mt-2 flex items-center gap-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
            isDraft
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {isDraft ? <Unlock size={14} /> : <Lock size={14} />}
          {version.status}
        </span>
        {version.is_active && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <ShieldCheck size={14} /> Active
          </span>
        )}
      </div>
    </div>
   
  </div>
);