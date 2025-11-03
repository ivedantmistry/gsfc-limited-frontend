// /components/inventory/product-detail/ParameterSection.tsx
import { ParameterDefinition } from "@/lib/types";
import { Plus } from "lucide-react";
import { ParameterTable } from "./ParameterTable";

interface ParameterSectionProps {
  isDraft: boolean;
  versionId: number;
  parameters: ParameterDefinition[];
  onOpenParamModal: (
    scope: { versionId: number },
    paramToEdit?: ParameterDefinition | null
  ) => void;
}

export const ParameterSection = ({
  isDraft,
  versionId,
  parameters,
  onOpenParamModal,
}: ParameterSectionProps) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold text-slate-700">Parameters</h4>
      {isDraft && (
        <button
          onClick={() => onOpenParamModal({ versionId: versionId })}
          className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-2 py-1 text-xs ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
        >
          <Plus size={14} /> Add Parameter
        </button>
      )}
    </div>
    <ParameterTable
      parameters={parameters}
      onEdit={
        isDraft
          ? (param) => onOpenParamModal({ versionId: versionId }, param)
          : undefined
      }
    />
  </div>
);