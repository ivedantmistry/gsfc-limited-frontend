"use client";

import React, { useState, use } from "react";
import { useProduct } from "@/lib/api/product";
import {
  useVersions,
  createVersion,
  lockVersion,
  activateVersion,
  createNewVersionFromExisting,
  deleteVersion, // ✅ 1. Import deleteVersion
} from "@/lib/api/version";
import { CreateVersionModal } from "@/components/modals/CreateVersionModal";
import { VersionListHeader } from "@/components/inventory/versions/VersionListHeader";
import { VersionTable } from "@/components/inventory/versions/VersionTable";
import { ConfirmLockModal } from "@/components/modals/ConfirmLockModal"; // ✅ 2. Import the new modal
import { Version } from "@/lib/types"; // ✅ 3. Import Version type

export default function VersionManagementPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;

  const { product, isLoading: isProductLoading } = useProduct(productId);
  const {
    versions,
    isLoading: areVersionsLoading,
    mutate: mutateVersions,
  } = useVersions(productId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ✅ 4. Add state for the lock confirmation modal
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [versionToLock, setVersionToLock] = useState<Version | null>(null);

  // --- API Handlers ---
  const handleCreate = async (versionName: string) => {
    await createVersion({ product: Number(productId), version_name: versionName });
    mutateVersions();
    setIsCreateModalOpen(false);
  };

  // ✅ 5. This function now just opens the modal
  const openLockModal = (versionId: number) => {
    const version = versions?.find((v) => v.id === versionId);
    if (version) {
      setVersionToLock(version);
      setIsLockModalOpen(true);
    }
  };

  // ✅ 6. This new function handles the actual API call after confirmation
  const handleConfirmLock = async () => {
    if (!versionToLock) return;
    try {
      await lockVersion(versionToLock.id);
      mutateVersions();
    } catch (error) {
      console.error("Failed to lock version:", error);
      // Optionally, show an error notification to the user
    } finally {
      setIsLockModalOpen(false);
      setVersionToLock(null);
    }
  };

  const handleActivate = async (versionId: number) => {
    if (
      window.confirm(
        "Set this as the active version? This will deactivate any other active version."
      )
    ) {
      await activateVersion(versionId);
      mutateVersions();
    }
  };

  const handleClone = async (versionId: number) => {
    await createNewVersionFromExisting(versionId);
    mutateVersions();
  };

  // ✅ 7. handleDelete now calls the real API endpoint
  const handleDelete = async (versionId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this draft version? This action cannot be undone."
      )
    ) {
      try {
        await deleteVersion(versionId);
        mutateVersions(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete version:", error);
        // Optionally, show an error notification to the user
      }
    }
  };

  const isLoading = isProductLoading || areVersionsLoading;

  if (isLoading) return <div>Loading Versions...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <>
      <CreateVersionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        productId={productId}
        onSuccess={handleCreate}
      />
      
      {/* ✅ 8. Render the new confirmation modal */}
      <ConfirmLockModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        onConfirm={handleConfirmLock}
        versionName={versionToLock?.version_name}
      />

      <div className="space-y-6">
        <VersionListHeader
          product={product}
          onAddNew={() => setIsCreateModalOpen(true)}
        />
        <VersionTable
          versions={versions}
          productId={product.id}
          onLock={openLockModal} // ✅ 9. Pass the correct handler to the table
          onActivate={handleActivate}
          onClone={handleClone}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}