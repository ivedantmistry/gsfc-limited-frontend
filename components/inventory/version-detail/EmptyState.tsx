import React from "react";
import { Layers, FlaskConical } from "lucide-react";

interface EmptyStateProps {
  onAddGradeClick: () => void;
  onAddParameterClick: () => void;
}

export const EmptyState = ({
  onAddGradeClick,
  onAddParameterClick,
}: EmptyStateProps) => (
  <div className="text-center bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-300">
    <h3 className="text-lg font-semibold text-slate-800">
      This Draft Version is Empty
    </h3>
    <p className="mt-1 text-sm text-slate-500">
      Choose how to structure this blueprint. You can add quality grades, or add
      testable parameters directly.
    </p>
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-md mx-auto">
      <button
        onClick={onAddGradeClick}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
      >
        <Layers className="w-8 h-8 text-indigo-600 mb-2" />
        <span className="font-semibold text-slate-700">Add Grades</span>
        <span className="text-xs text-slate-500">e.g., Grade A, Grade B</span>
      </button>
      <button
        onClick={onAddParameterClick}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm hover:border-green-500 hover:bg-green-50 transition-colors"
      >
        <FlaskConical className="w-8 h-8 text-green-600 mb-2" />
        <span className="font-semibold text-slate-700">Add Parameters</span>
        <span className="text-xs text-slate-500">e.g., Viscosity, pH</span>
      </button>
    </div>
  </div>
);