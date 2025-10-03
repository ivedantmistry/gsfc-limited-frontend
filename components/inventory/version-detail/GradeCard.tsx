import React from "react";
import { ProductGrade } from "@/lib/types";
import { Plus } from "lucide-react";
import { ParameterTable } from "./ParameterTable";

interface GradeCardProps {
  grade: ProductGrade;
  isDraft: boolean;
  onAddParameter: () => void;
  canManage: boolean;
}

export const GradeCard = ({
  grade,
  isDraft,
  onAddParameter,
  canManage,
}: GradeCardProps) => {
  const parameters = grade.parameters ?? [];
  const hasParameters = parameters.length > 0;

  return (
    <div className="bg-white border border-slate-200/70 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200/70 flex justify-between items-center">
        {isDraft && canManage && (
          <button
            onClick={onAddParameter}
            className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-3 py-1.5 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          >
            <Plus size={16} /> Add Parameter
          </button>
        )}
      </div>
      <div className="p-4">
        {hasParameters ? (
          <ParameterTable parameters={parameters} />
        ) : (
          <p className="text-center text-sm text-slate-500 py-4">
            No parameters defined for this grade.
          </p>
        )}
      </div>
    </div>
  );
};
