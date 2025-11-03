// /components/inventory/product-detail/GradeCard.tsx
import { ProductGrade as Grade, ParameterDefinition } from "@/lib/types";
import { FlaskConical } from "lucide-react";
import { ParameterTable } from "./ParameterTable";

interface GradeCardProps {
  grade: Grade;
  isDraft: boolean;
  onAddParameter: () => void;
  onEditParameter: (param: ParameterDefinition) => void;
}

export const GradeCard = ({
  grade,
  isDraft,
  onAddParameter,
  onEditParameter,
}: GradeCardProps) => {
  const hasParameters = grade.parameters.length > 0;
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-5 h-5 text-indigo-600" />
          <div>
            <h4 className="font-semibold text-slate-800">{grade.name}</h4>
            {grade.description && (
              <p className="text-sm text-slate-500">{grade.description}</p>
            )}
          </div>
        </div>
        {isDraft && (
          <button
            onClick={onAddParameter}
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            Add Parameter
          </button>
        )}
      </div>
      {hasParameters && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <ParameterTable
            parameters={grade.parameters}
            onEdit={isDraft ? onEditParameter : undefined}
          />
        </div>
      )}
    </div>
  );
};