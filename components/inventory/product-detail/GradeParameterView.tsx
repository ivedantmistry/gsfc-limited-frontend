"use client";

import React from "react";
import { useParameters } from "@/lib/api/product";
import { ProductGrade } from "@/lib/types/";
import { ParameterTable } from "./ParameterTable";
import { PlusCircle } from "lucide-react"; // Import icon

// 1. Add 'onAddParameter' to the props interface
interface GradeParameterViewProps {
  grade: ProductGrade;
  onAddParameter: () => void;
}

export const GradeParameterView = ({ grade, onAddParameter }: GradeParameterViewProps) => {
  const { parameters, isLoading, mutate } = useParameters({ gradeId: grade.id });

  return (
    <details
      key={grade.name}
      className="group bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      open
    >
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
        <h3 className="font-semibold text-gray-900">{grade.name}</h3>
        {/* 2. Add the button to add a parameter to this specific grade */}
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevents the <details> from toggling
            onAddParameter();
          }}
          className="inline-flex items-center gap-2 text-xs text-white bg-gray-700 px-2.5 py-1 rounded-md font-medium hover:bg-gray-800"
        >
          <PlusCircle size={14} />
          Add Parameter
        </button>
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