"use client";

import React, { useState } from "react";
import { Plus, ChevronDown, FlaskConical } from "lucide-react";
import { ParameterTable } from "@/components/inventory/product-detail/ParameterTable";
import { VersionManager } from "@/components/inventory/product-detail/VersionManager";
import { ProductGrade, ParameterDefinition } from "@/lib/types";

type GradeWithParameters = ProductGrade & { parameters: ParameterDefinition[] };

export const GradeCard = ({
  grade,
  color,
  onAddParameter,
}: {
  grade: GradeWithParameters;
  color: string;
  onAddParameter: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasParameters = grade.parameters && grade.parameters.length > 0;
  const colorClasses = {
    sky: {
      border: "border-sky-500",
      bg: "bg-sky-50",
      text: "text-sky-700",
      ring: "ring-sky-200",
    },
    teal: {
      border: "border-teal-500",
      bg: "bg-teal-50",
      text: "text-teal-700",
      ring: "ring-teal-200",
    },
    rose: {
      border: "border-rose-500",
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
    },
    amber: {
      border: "border-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-200",
    },
    violet: {
      border: "border-violet-500",
      bg: "bg-violet-50",
      text: "text-violet-700",
      ring: "ring-violet-200",
    },
  };
  const selectedColor =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.sky;

  return (
    <div
      className={`bg-white rounded-lg shadow-md transition-all duration-300 border-l-4 ${selectedColor.border}`}
    >
      <button
        className="flex items-center justify-between w-full p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${selectedColor.bg}`}>
            <FlaskConical className={`w-6 h-6 ${selectedColor.text}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{grade.name}</h3>
            <p className="text-sm text-slate-500">
              {grade.description || "No description"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${selectedColor.bg} ${selectedColor.text} ${selectedColor.ring}`}
          >
            {grade.parameters.length} Parameters
          </span>
          <ChevronDown
            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4">
          <div className="border-t border-slate-200 pt-4 space-y-6">
            <div>
              <h4 className="text-base font-semibold text-slate-700 mb-2">
                Parameters
              </h4>
              {hasParameters ? (
                <ParameterTable parameters={grade.parameters} />
              ) : (
                <p className="text-sm text-center text-slate-500 py-4">
                  No parameters for this grade yet.
                </p>
              )}
              <button
                onClick={onAddParameter}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                <Plus size={16} /> Add Parameter to this Grade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
