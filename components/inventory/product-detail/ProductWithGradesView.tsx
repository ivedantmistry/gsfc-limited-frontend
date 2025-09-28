"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Product } from "@/lib/types"; // Make sure to import the Product type
import { GradeCard } from "./GradeCard";

// NEW: Define the types for this component's props as well
interface ProductWithGradesViewProps {
  product: Product;
  openGradeModal: () => void;
  openParamModal: (scope: any) => void;
}

export const ProductWithGradesView: React.FC<ProductWithGradesViewProps> = ({
  product,
  openGradeModal,
  openParamModal,
}) => {
  const gradeColors = ["sky", "teal", "rose", "amber", "violet"];
  const addButtonStyle =
    "inline-flex items-center gap-2 rounded-md bg-white text-slate-800 font-medium px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100/80";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Product Grades</h2>
        <button onClick={openGradeModal} className={addButtonStyle}>
          <Plus size={16} /> Add Grade
        </button>
      </div>
      <div className="space-y-4">
        {product.grades.map((grade, index) => (
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
