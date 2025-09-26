"use client";

import React, { use, useState } from "react";
// FINAL: We only need useProduct now.
import { useProduct } from "@/lib/api/products";
import { Plus, ChevronDown, FlaskConical } from "lucide-react";
import { EmptyState } from "@/components/inventory/product-detail/EmptyState";
import { ParameterTable } from "@/components/inventory/product-detail/ParameterTable";
import AddGradeModal from "@/components/inventory/AddGradeModal";
import AddParameterModal from "@/components/inventory/AddParameterModal";
import { ProductGrade, ParameterDefinition } from "@/lib/types";

// The GradeCard component is correct and needs no changes.
type GradeWithParameters = ProductGrade & { parameters: ParameterDefinition[] };

const GradeCard = ({
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
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4">
          <div className="border-t border-slate-200 pt-4">
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
  );
};

export default function ProductParametersPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [paramModalScope, setParamModalScope] = useState({});

  // FINAL: We only fetch the product. It now contains all grades and parameters.
  const {
    product,
    isLoading,
    mutate: mutateProduct,
  } = useProduct(resolvedParams.productId);

  const openParamModal = (scope: any) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
  };

  const gradeColors = ["sky", "teal", "rose", "amber", "violet"];
  const addButtonStyle =
    "inline-flex items-center gap-2 rounded-md bg-white text-slate-800 font-medium px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100/80 transition-colors";

  if (isLoading) {
    return (
      <div className="bg-white/80 p-6 rounded-xl border border-slate-200/70 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
        <div className="h-24 bg-slate-200 rounded-lg"></div>
      </div>
    );
  }

  const hasGrades = product && product.grades && product.grades.length > 0;
  // The 'parameters' field on the product now holds the direct parameters
  const hasDirectParams =
    product && product.parameters && product.parameters.length > 0;

  // Case 1: The product has grades defined.
  if (hasGrades) {
    return (
      <>
        <AddGradeModal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          productId={resolvedParams.productId}
          onSuccess={mutateProduct}
        />
        <AddParameterModal
          isOpen={isParamModalOpen}
          onClose={() => setIsParamModalOpen(false)}
          scope={paramModalScope}
          onSuccess={mutateProduct}
        />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Product Grades
            </h2>
            <button
              onClick={() => setIsGradeModalOpen(true)}
              className={addButtonStyle}
            >
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
      </>
    );
  }

  // Case 2: No grades, but has direct parameters.
  if (hasDirectParams) {
    return (
      <>
        <AddParameterModal
          isOpen={isParamModalOpen}
          onClose={() => setIsParamModalOpen(false)}
          scope={paramModalScope}
          onSuccess={mutateProduct}
        />
        <div className="bg-white/80 rounded-xl border border-slate-200/70">
          <div className="flex justify-between items-center p-4 border-b border-slate-200/70">
            <h2 className="text-lg font-semibold text-slate-900">Parameters</h2>
            <button
              onClick={() =>
                openParamModal({ productId: resolvedParams.productId })
              }
              className={addButtonStyle}
            >
              <Plus size={16} /> Add Parameter
            </button>
          </div>
          <ParameterTable parameters={product.parameters} />
        </div>
      </>
    );
  }

  // Case 3: The product is completely empty.
  return (
    <>
      <AddGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        productId={resolvedParams.productId}
        onSuccess={mutateProduct}
      />
      <AddParameterModal
        isOpen={isParamModalOpen}
        onClose={() => setIsParamModalOpen(false)}
        scope={paramModalScope}
        onSuccess={mutateProduct}
      />
      <div className="bg-white/80 rounded-xl border border-slate-200/70">
        <EmptyState
          onAddGradeClick={() => setIsGradeModalOpen(true)}
          onAddParameterClick={() =>
            openParamModal({ productId: resolvedParams.productId })
          }
        />
      </div>
    </>
  );
}
