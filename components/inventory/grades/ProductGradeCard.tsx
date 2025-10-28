"use client";

import React from "react";
import { ProductGrade } from "@/lib/types";
import { ParameterTable } from "@/components/inventory/parameters/ParameterTable";

interface ProductGradeCardProps {
  grade: ProductGrade;
}

export const ProductGradeCard = ({ grade }: ProductGradeCardProps) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {/* Grade Header */}
      <div className="p-4 bg-slate-50/70 border-b rounded-t-lg">
        <h4 className="font-semibold text-slate-800">{grade.name}</h4>
        {grade.description && (
          <p className="text-sm text-slate-600 mt-1">{grade.description}</p>
        )}
      </div>

      {/* Re-used Parameter Table */}
      <div className="p-4">
        <ParameterTable parameters={grade.parameters} />
      </div>
    </div>
  );
};