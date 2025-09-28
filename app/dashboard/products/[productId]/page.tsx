"use client";

import React, { useState, use } from "react";
import { useProduct } from "@/lib/api/product";
import AddGradeModal from "@/components/inventory/AddGradeModal";
import AddParameterModal from "@/components/inventory/AddParameterModal";
import { ProductWithGradesView } from "@/components/inventory/product-detail/ProductWithGradesView";
import { ProductWithNoGradesView } from "@/components/inventory/product-detail/ProductWithNoGradesView";

export default function ProductParametersPage({
  params,
}: {
  // The 'params' prop is a Promise
  params: Promise<{ productId: string }>;
}) {
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [paramModalScope, setParamModalScope] = useState({});
 const resolvedParams = use(params);
const {
    product,
    isLoading,
    mutate: mutateProduct,
  } = useProduct(resolvedParams.productId);

  const openParamModal = (scope: any) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 p-6 rounded-xl border border-slate-200/70 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
        <div className="h-24 bg-slate-200 rounded-lg"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">Product Not Found</h2>
        <p className="text-slate-500">
          The requested product could not be loaded.
        </p>
      </div>
    );
  }

  // CORRECTED LOGIC: Check for grades within the active version
  const activeVersion = product.versions.find((v) => v.is_active);
  const hasGrades = activeVersion ? activeVersion.grades.length > 0 : false;

  return (
    <>
      {/* The modal is only available if there is an active version to add a grade to */}
      {activeVersion && (
        <AddGradeModal
          isOpen={isGradeModalOpen}
          onClose={() => setIsGradeModalOpen(false)}
          // CORRECTED PROP: Pass the active version's ID
          versionId={activeVersion.id}
          onSuccess={mutateProduct}
        />
      )}

      <AddParameterModal
        isOpen={isParamModalOpen}
        onClose={() => setIsParamModalOpen(false)}
        scope={paramModalScope}
        onSuccess={mutateProduct}
      />

      {/* The view logic now correctly checks the 'hasGrades' flag derived from the active version */}
      {hasGrades ? (
        <ProductWithGradesView
          product={product}
          openGradeModal={() => setIsGradeModalOpen(true)}
          openParamModal={openParamModal}
        />
      ) : (
        <ProductWithNoGradesView product={product} />
      )}
    </>
  );
}
