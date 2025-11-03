// /components/inventory/product-detail/GradeSection.tsx
import { ProductGrade as Grade, ParameterDefinition } from "@/lib/types";
import { Plus } from "lucide-react";
import { GradeCard } from "./GradeCard";

interface GradeSectionProps {
  isDraft: boolean;
  versionId: number;
  grades: Grade[];
  onOpenGradeModal: (versionId: number) => void;
  onOpenParamModal: (
    scope: { gradeId: number },
    paramToEdit?: ParameterDefinition | null
  ) => void;
}

export const GradeSection = ({
  isDraft,
  versionId,
  grades,
  onOpenGradeModal,
  onOpenParamModal,
}: GradeSectionProps) => (
  <div>
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-semibold text-slate-700">Product Grades</h4>
      {isDraft && (
        <button
          onClick={() => onOpenGradeModal(versionId)}
          className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-2 py-1 text-xs ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
        >
          <Plus size={14} /> Add Grade
        </button>
      )}
    </div>
    <div className="space-y-3">
      {grades.map((g: Grade) => (
        <GradeCard
          key={g.id}
          grade={g}
          isDraft={isDraft}
          onAddParameter={() => onOpenParamModal({ gradeId: g.id })}
          onEditParameter={(param) =>
            onOpenParamModal({ gradeId: g.id }, param)
          }
        />
      ))}
    </div>
  </div>
);