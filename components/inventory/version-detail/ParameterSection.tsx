import React from "react";
import { ParameterDefinition } from "@/lib/types";
import { Plus } from "lucide-react";
import { ParameterTable } from "./ParameterTable";

interface ParameterSectionProps {
  isDraft: boolean;
  versionId: number;
  parameters: ParameterDefinition[];
  onOpenParamModal: (scope: { versionId?: number }) => void;
    canManage: boolean; 
}

export const ParameterSection = ({
  isDraft,
  canManage,
  versionId,
  parameters,
  onOpenParamModal,
}: ParameterSectionProps) => (
  <div className="p-6 bg-white rounded-xl border border-slate-200/70 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-semibold text-slate-800">Parameters</h4>
  {isDraft && canManage && (
        
        <button
          onClick={() => onOpenParamModal({ versionId: versionId })}
          className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-3 py-1.5 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          <Plus size={16} /> Add Parameter
        </button>
      )}
    </div>
    <ParameterTable parameters={parameters} />
  </div>
);