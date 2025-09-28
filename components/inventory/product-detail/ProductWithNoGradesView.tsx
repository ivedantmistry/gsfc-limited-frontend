"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Product } from "@/lib/types"; // Make sure to import the Product type
import { SpecificationManager } from "./SpecificationManager";
import { ParameterTable } from "./ParameterTable";
import { EmptyState } from "./EmptyState";

// NEW: Define the types for the component's props
interface ProductWithNoGradesViewProps {
  product: Product;
  openGradeModal: () => void;
  openParamModal: (scope: any) => void;
}

export const ProductWithNoGradesView: React.FC<ProductWithNoGradesViewProps> = ({
  product,
  openGradeModal,
  openParamModal,
}) => {
  const hasDirectParams = product.parameters && product.parameters.length > 0;
  const addButtonStyle =
    "inline-flex items-center gap-2 rounded-md bg-white text-slate-800 font-medium px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100/80";

  return (
    <div className="space-y-8">
      <div>
        {hasDirectParams ? (
          <div className="bg-white/80 rounded-xl border border-slate-200/70">
            <div className="flex justify-between items-center p-4 border-b border-slate-200/70">
              <h2 className="text-lg font-semibold text-slate-900">
                Parameters
              </h2>
              <button
                onClick={() => openParamModal({ productId: product.id })}
                className={addButtonStyle}
              >
                <Plus size={16} /> Add Parameter
              </button>
            </div>
            <ParameterTable parameters={product.parameters} />
          </div>
        ) : (
          <div className="bg-white/80 rounded-xl border border-slate-200/70">
            <EmptyState
              onAddGradeClick={openGradeModal}
              onAddParameterClick={() => openParamModal({ productId: product.id })}
            />
          </div>
        )}
      </div>

      <SpecificationManager
        scope={{ productId: product.id }}
        availableParameters={product.parameters}
      />
    </div>
  );
};