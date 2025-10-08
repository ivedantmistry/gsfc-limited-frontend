import React from "react";
import { ProductGrade, ParameterDefinition } from "@/lib/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ParameterTable } from "./ParameterTable";

interface GradeCardProps {
  grade: ProductGrade;
  isDraft: boolean;
  onAddParameter: () => void;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onEditParameter: (parameter: ParameterDefinition) => void;
  onDeleteParameter: (parameter: ParameterDefinition) => void;
}

export const GradeCard = ({
  grade,
  isDraft,
  onAddParameter,
  canManage,
  onEdit,
  onDelete,
  onEditParameter,
  onDeleteParameter,
}: GradeCardProps) => {
  const parameters = grade.parameters ?? [];
  const hasParameters = parameters.length > 0;

  return (
    <div className="bg-white border border-slate-200/70 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200/70 flex justify-between items-center">
        <h4 className="font-semibold text-slate-800">{grade.name}</h4>
        <div className="flex items-center gap-2">
          {isDraft && canManage && (
            <button
              onClick={onEdit}
              title="Edit Grade"
              className="p-1.5 rounded-md bg-white text-slate-500 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:text-slate-800"
            >
              <Pencil size={16} />
            </button>
          )}
          {isDraft && canManage && (
            <button
              onClick={onDelete}
              title="Delete Grade"
              className="p-1.5 rounded-md bg-white text-red-500 ring-1 ring-inset ring-slate-300 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          )}
          {isDraft && canManage && (
            <button
              onClick={onAddParameter}
              className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-3 py-1.5 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              <Plus size={16} /> Add Parameter
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        {hasParameters ? (
          <ParameterTable
            parameters={parameters}
            isDraft={isDraft}
            canManage={canManage}
            onEditParameter={onEditParameter}
            onDeleteParameter={onDeleteParameter}
          />
        ) : (
          <p className="text-center text-sm text-slate-500 py-4">
            No parameters defined for this grade.
          </p>
        )}
      </div>
    </div>
  );
};
