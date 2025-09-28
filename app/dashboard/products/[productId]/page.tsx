// /app/dashboard/products/[productId]/page.tsx
"use client";

import React, { useState, use } from "react";
import { useProduct } from "@/lib/api/product";
import AddGradeModal from "@/components/inventory/AddGradeModal";
import AddParameterModal from "@/components/inventory/AddParameterModal";
import { VersionManager } from "@/components/inventory/product-detail/VersionManager";

// This specific type definition will help TypeScript understand the scope
type ParamModalScope = {
  versionId?: number;
  gradeId?: number;
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [targetVersionId, setTargetVersionId] = useState<number | null>(null);
  const [paramModalScope, setParamModalScope] = useState<ParamModalScope>({});

  const resolvedParams = use(params);

  const {
    product,
    isLoading,
    mutate: mutateProduct,
  } = useProduct(resolvedParams.productId);

  const openGradeModal = (versionId: number) => {
    setTargetVersionId(versionId);
    setIsGradeModalOpen(true);
  };

  const openParamModal = (scope: ParamModalScope) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
  };

  // ✅ THIS IS THE CRITICAL FIX ✅
  // If the data is loading OR if the product hasn't been defined yet,
  // show a loading state and stop execution here.
  if (isLoading || !product) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Loading skeleton for the header */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-8 bg-slate-300 rounded w-1/2"></div>
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        </div>
        {/* Loading skeleton for the version manager */}
        <div className="h-64 bg-slate-200 rounded-lg"></div>
      </div>
    );
  }

  // Because of the check above, TypeScript now knows that 'product' is defined.
  return (
    <>
      <AddGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        versionId={targetVersionId!}
        onSuccess={mutateProduct}
      />

      <AddParameterModal
        isOpen={isParamModalOpen}
        onClose={() => setIsParamModalOpen(false)}
        scope={paramModalScope}
        onSuccess={mutateProduct}
      />

      <div className="space-y-6">
        <VersionManager
          productId={product.id}
          versions={product.versions}
          isLoading={isLoading}
          mutate={mutateProduct}
          openParamModal={openParamModal}
          openGradeModal={openGradeModal}
        />
      </div>
    </>
  );
}
