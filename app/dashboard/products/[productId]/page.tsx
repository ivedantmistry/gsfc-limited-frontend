"use client";

import React, { use, useState } from "react";
import { useProduct, useParameters } from "@/lib/api/products";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/components/inventory/product-detail/EmptyState";
import { GradeParameterView } from "@/components/inventory/product-detail/GradeParameterView";
import { ParameterTable } from "@/components/inventory/product-detail/ParameterTable";
import AddGradeModal from "@/components/inventory/AddGradeModal"; // Import the new modal

export default function ProductParametersPage({
  params,
}: {
  params: Promise<{ productId: string }>; // Note: params is now a Promise
}) {
  const resolvedParams = use(params);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const {
    product,
    isLoading: productLoading,
    mutate: mutateProduct,
  } = useProduct(resolvedParams.productId);
  const { parameters, isLoading: paramsLoading } = useParameters({
    productId: resolvedParams.productId,
  });

  if (productLoading || paramsLoading) {
    return (
      <div className="bg-gray-100/50 p-6 rounded-xl border border-gray-200 h-64 animate-pulse"></div>
    );
  }

   // Case 1: The product has grades defined.
  if (product && product.grades.length > 0) {
    return (
      <>
        <AddGradeModal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          productId={resolvedParams.productId}
          onSuccess={mutateProduct}
        />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Product Grades</h2>
            {/* Connect the button to open the modal */}
            <button onClick={() => setIsGradeModalOpen(true)} className="inline-flex items-center gap-2 text-sm text-white bg-gray-800 px-3 py-1.5 rounded-md font-medium">
              <PlusCircle size={16} /> Add Grade
            </button>
          </div>
          {product.grades.map((grade) => (
            <GradeParameterView key={grade.id} grade={grade} />
          ))}
        </div>
      </>
    );
  }

  // Case 2: The product has no grades, but has direct parameters.
  if (parameters && parameters.length > 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Direct Parameters
          </h2>
          <button className="inline-flex items-center gap-2 text-sm text-white bg-gray-800 px-3 py-1.5 rounded-md font-medium">
            <PlusCircle size={16} /> Add Parameter
          </button>
        </div>
        <ParameterTable parameters={parameters} />
      </div>
    );
  }

  // Case 3: The product is completely empty.
  // Case 3: The product is completely empty.
  // We need to modify EmptyState to accept an onClick handler
  return (
    <>
      <AddGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        productId={resolvedParams.productId}
        onSuccess={mutateProduct}
      />
      {/* We need to update the EmptyState component to handle the click */}
      <EmptyState onAddGradeClick={() => setIsGradeModalOpen(true)} />
    </>
  );
}
