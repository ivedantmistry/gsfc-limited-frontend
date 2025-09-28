"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Product } from "@/lib/types/";
import { GradeCard } from "./GradeCard";

interface ProductWithGradesViewProps {
  product: Product;
  openGradeModal: (versionId: number) => void;
  openParamModal: (scope: { gradeId: number }) => void;
}

export const ProductWithGradesView: React.FC<ProductWithGradesViewProps> = ({
  product,
  openGradeModal,
  openParamModal,
}) => {
  // Find the currently active version from the product's versions list
  const activeVersion = product.versions.find((v) => v.is_active);

  const gradeColors = ["sky", "teal", "rose", "amber", "violet"];
  const addButtonStyle =
    "inline-flex items-center gap-2 rounded-md bg-white text-slate-800 font-medium px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100/80";

  if (!activeVersion || activeVersion.grades.length === 0) {
    return (
      <div className="text-center p-8 bg-white/80 rounded-xl border border-slate-200/70">
        <p className="font-semibold text-slate-700">No Active Grades</p>
        <p className="text-sm text-slate-500 mb-4">
          The active version of this product has no grades defined.
        </p>
        {activeVersion && (
            <button onClick={() => openGradeModal(activeVersion.id)} className={addButtonStyle}>
                <Plus size={16} /> Add Grade to Version: {activeVersion.version_name}
            </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Product Grades (Version: {activeVersion.version_name})
        </h2>
        <button onClick={() => openGradeModal(activeVersion.id)} className={addButtonStyle}>
          <Plus size={16} /> Add Grade
        </button>
      </div>
      <div className="space-y-4">
        {/* Map over the grades of the active version */}
        {activeVersion.grades.map((grade, index) => (
          <GradeCard
            key={grade.id}
            grade={grade}
            color={gradeColors[index % gradeColors.length]}
            onAddParameter={() => openParamModal({ gradeId: grade.id })}
          />
        ))}
      </div>
    </div>
  );
};