"use client";

import React from "react";
import { VersionNested } from "@/lib/types";
import { Lock, Unlock, ShieldCheck } from "lucide-react";
import { EditableField } from "@/components/shared/EditableField"; // Import the new component

interface VersionHeaderProps {
  version: VersionNested;
  isDraft: boolean;
  onNameUpdate: (newName: string) => Promise<void>; // Add this handler
}

export const VersionHeader: React.FC<VersionHeaderProps> = ({
  version,
  isDraft,
  onNameUpdate,
}) => (
  <div className="flex justify-between items-start">
    <div>
      {/* ✅ REPLACE H1 WITH EDITABLE FIELD */}
      <EditableField
        initialValue={version.version_name}
        onSave={onNameUpdate}
        fieldName="Version Name"
        canEdit={isDraft} // Only editable if it's a draft
        textClass="text-3xl font-bold tracking-tight text-slate-900"
        inputClass="text-3xl font-bold"
      />
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
