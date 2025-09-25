"use client";

import React from "react";
import { useParameters } from "../../../lib/api/products";
import { ProductGrade } from "@/lib/types/";
import { ParameterTable } from "./ParameterTable";

interface GradeParameterViewProps {
  grade: ProductGrade;
}

export const GradeParameterView = ({ grade }: GradeParameterViewProps) => {
  const { parameters, isLoading } = useParameters({ gradeId: grade.id });

  return (
    <details
      key={grade.name}
      className="group bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      open
    >
      <summary className="flex items-center justify-between p-4 cursor-pointer">
        <h3 className="font-semibold text-gray-900">{grade.name}</h3>
      </summary>
      <div className="border-t border-gray-200">
        {isLoading ? (
          <div className="p-4 text-sm text-gray-500">Loading parameters...</div>
        ) : (
          <ParameterTable parameters={parameters} />
        )}
      </div>
    </details>
  );
};