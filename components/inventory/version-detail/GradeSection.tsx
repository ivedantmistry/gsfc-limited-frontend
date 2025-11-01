import React from "react";
import { ProductGrade, ParameterDefinition } from "@/lib/types";
import { Plus } from "lucide-react";
import { GradeCard } from "./GradeCard";

interface GradeSectionProps {
  isDraft: boolean;
  versionId: number;
  grades: ProductGrade[];
  onOpenGradeModal: (versionId: number) => void;
  onOpenParamModal: (scope: { gradeId?: number }) => void;
  canManage: boolean;
  onEditGrade: (grade: ProductGrade) => void;
  onEditParameter: (parameter: ParameterDefinition) => void;
  onDeleteGrade: (grade: ProductGrade) => void;
  onDeleteParameter: (parameter: ParameterDefinition) => void;
}

export const GradeSection = ({
  isDraft,
  versionId,
  grades,
  canManage,
  onOpenGradeModal,
  onOpenParamModal,
  onEditGrade,
  onEditParameter,
  onDeleteGrade,
  onDeleteParameter,
}: GradeSectionProps) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-900">Product Grades</h2>
      {isDraft && canManage && (
        <button
          onClick={() => onOpenGradeModal(versionId)}
          className="inline-flex items-center gap-2 rounded-md bg-white text-slate-700 font-medium px-3 py-2 text-sm border border-slate-300 hover:bg-slate-50"
        >
          <Plus size={16} /> Add Grade
        </button>
      )}
    </div>
    {grades.map((g: ProductGrade) => (
      <GradeCard
        key={g.id}
        grade={g}
        isDraft={isDraft}
        onAddParameter={() => onOpenParamModal({ gradeId: g.id })}
        canManage={canManage}
        onEdit={() => onEditGrade(g)}
        onEditParameter={onEditParameter}
        onDelete={() => onDeleteGrade(g)}
        onDeleteParameter={onDeleteParameter}
      />
    ))}
  </div>
);
