// /components/inventory/product-detail/ProductDetailView.tsx
"use client";

import React, { useState } from "react";
import { Product, ParameterDefinition } from "@/lib/types";
import {
  activateVersion,
  createNewVersionFromExisting,
  lockVersion,
} from "@/lib/api/version";

import { CreateVersionModal } from "@/components/modals/CreateVersionModal";
import AddGradeModal from "@/components/modals/AddGradeModal";
import AddParameterModal from "@/components/modals/AddParameterModal";
import { ProductHeader } from "./ProductHeader";
import { VersionSection } from "./VersionSection";

interface ProductDetailViewProps {
  product: Product;
  onDataChange: () => void;
}

export function ProductDetailView({
  product,
  onDataChange,
}: ProductDetailViewProps) {
  // --- State Management for Modals ---
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [targetVersionId, setTargetVersionId] = useState<number | null>(null);
  const [paramModalScope, setParamModalScope] = useState<{
    versionId?: number;
    gradeId?: number;
  }>({});
  const [editingParameter, setEditingParameter] =
    useState<ParameterDefinition | null>(null);

  // --- Handler Functions for API Calls ---
  const handleLock = async (versionId: number) => {
    if (!window.confirm("Locking a version is permanent. Are you sure?"))
      return;
    await lockVersion(versionId);
    onDataChange();
  };

  const handleActivate = async (versionId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to set this as the active version?"
      )
    )
      return;
    await activateVersion(versionId);
    onDataChange();
  };

  const handleClone = async (versionId: number) => {
    await createNewVersionFromExisting(versionId);
    onDataChange();
  };

  // --- Handler Functions for Opening Modals ---
  const openGradeModal = (versionId: number) => {
    setTargetVersionId(versionId);
    setIsGradeModalOpen(true);
  };

  const openParamModal = (
    scope: { versionId?: number; gradeId?: number },
    paramToEdit: ParameterDefinition | null = null
  ) => {
    setParamModalScope(scope);
    setEditingParameter(paramToEdit);
    setIsParamModalOpen(true);
  };

  const closeParamModal = () => {
    setIsParamModalOpen(false);
    setEditingParameter(null);
    setParamModalScope({});
  };

  return (
    <>
      {/* --- Modals --- */}
      <CreateVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        productId={product.id}
        onSuccess={onDataChange}
      />
      <AddGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        versionId={targetVersionId}
        onSuccess={onDataChange}
      />
      <AddParameterModal
        isOpen={isParamModalOpen}
        onClose={closeParamModal}
        scope={paramModalScope}
        onSuccess={onDataChange}
        editingParameter={editingParameter}
      />

      {/* --- Main UI --- */}
      <div className="space-y-8">
        <ProductHeader product={product} />
        <VersionSection
          versions={product.versions}
          onOpenCreateVersionModal={() => setIsVersionModalOpen(true)}
          onLock={handleLock}
          onActivate={handleActivate}
          onClone={handleClone}
          onOpenGradeModal={openGradeModal}
          onOpenParamModal={openParamModal}
        />
      </div>
    </>
  );
}
