"use client";

import React, { use, useState } from "react";
import { useProduct, useParameters } from "@/lib/api/products";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/components/inventory/product-detail/EmptyState";
import { GradeParameterView } from "@/components/inventory/product-detail/GradeParameterView";
import { ParameterTable } from "@/components/inventory/product-detail/ParameterTable";
import AddGradeModal from "@/components/inventory/AddGradeModal";
import AddParameterModal from "@/components/inventory/AddParameterModal";

export default function ProductParametersPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [paramModalScope, setParamModalScope] = useState({});

  const {
    product,
    isLoading: productLoading,
    mutate: mutateProduct,
  } = useProduct(resolvedParams.productId);
  const {
    parameters,
    isLoading: paramsLoading,
    mutate: mutateParams,
  } = useParameters({
    productId: resolvedParams.productId,
  });

  const openParamModal = (scope: any) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
  };

  if (productLoading || paramsLoading) {
    return (
      <div className="bg-gray-100/50 p-6 rounded-xl border border-gray-200 h-64 animate-pulse"></div>
    );
  }
  // Case 1: The product has grades defined.
  if (product && product.grades.length > 0) {
    return (
      <>
        {/* 3. Render the modals */}
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
            <h2 className="text-lg font-semibold text-gray-800">
              Product Grades
            </h2>
            <button onClick={() => setIsGradeModalOpen(true)} className="...">
              <PlusCircle size={16} /> Add Grade
            </button>
          </div>
          {product.grades.map((grade) => (
            // We need to update GradeParameterView to handle adding a parameter
            <GradeParameterView
              key={grade.id}
              grade={grade}
              onAddParameter={() => openParamModal({ gradeId: grade.id })}
            />
          ))}
        </div>
      </>
    );
  }

  // Case 2: The product has no grades, but has direct parameters.
  if (parameters && parameters.length > 0) {
    return (
      <>
        <AddParameterModal
          isOpen={isParamModalOpen}
          onClose={() => setIsParamModalOpen(false)}
          scope={paramModalScope}
          onSuccess={mutateParams}
        />
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Direct Parameters
            </h2>
            {/* 4. Connect the button to open the modal with the product scope */}
            <button
              onClick={() =>
                openParamModal({ productId: resolvedParams.productId })
              }
              className="..."
            >
              <PlusCircle size={16} /> Add Parameter
            </button>
          </div>
          <ParameterTable parameters={parameters} />
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
        onSuccess={mutateParams}
      />
      <EmptyState
        onAddGradeClick={() => setIsGradeModalOpen(true)}
        onAddParameterClick={() =>
          openParamModal({ productId: resolvedParams.productId })
        }
      />
    </>
  );
}
