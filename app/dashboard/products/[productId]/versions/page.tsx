"use client";

import React, { useState, use } from "react";
import { useProduct } from "@/lib/api/product";
import {
  useVersions,
  createVersion,
  lockVersion,
  activateVersion,
  createNewVersionFromExisting,
  deleteVersion,
} from "@/lib/api/version";
import { CreateVersionModal } from "@/components/modals/CreateVersionModal";
import { VersionListHeader } from "@/components/inventory/versions/VersionListHeader";
import { VersionGrid } from "@/components/inventory/versions/VersionGrid";
import { ConfirmLockModal } from "@/components/modals/ConfirmLockModal";
import { ConfirmActivateModal } from "@/components/modals/ConfirmActivateModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Version } from "@/lib/types";
import { useHasPermission } from "@/context/AuthContext";

export default function VersionManagementPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;
  const canManageVersions = useHasPermission("inventory.can_manage_versions");
  const { product, isLoading: isProductLoading } = useProduct(productId);
  const {
    versions,
    isLoading: areVersionsLoading,
    mutate: mutateVersions,
  } = useVersions(productId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [versionToProcess, setVersionToProcess] = useState<Version | null>(
    null
  );

  // ✅ 1. Add state for per-row actions and errors
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [errorRow, setErrorRow] = useState<{ id: number; message: string } | null>(
    null
  );

  // ✅ 2. Helper to clear errors when opening a new modal
  const openModal = (
    versionId: number,
    setModalOpen: (isOpen: boolean) => void
  ) => {
    const version = versions?.find((v) => v.id === versionId);
    if (version) {
      setErrorRow(null); // Clear any existing row errors
      setVersionToProcess(version);
      setModalOpen(true);
    }
  };

  const openLockModal = (versionId: number) =>
    openModal(versionId, setIsLockModalOpen);
  const openActivateModal = (versionId: number) =>
    openModal(versionId, setIsActivateModalOpen);
  const openDeleteModal = (versionId: number) =>
    openModal(versionId, setIsDeleteModalOpen);

  // ✅ 3. Fix for Create Modal
  // Your CreateVersionModal handles its own API call and error state.
  // This parent handler just needs to mutate and close on success.
  const handleCreateSuccess = () => {
    mutateVersions();
    setIsCreateModalOpen(false);
  };

  // ✅ 4. Add try/catch/finally to all API handlers
  const handleConfirmLock = async () => {
    if (!versionToProcess) return;

    setActionLoadingId(versionToProcess.id);
    setErrorRow(null);
    try {
      await lockVersion(versionToProcess.id);
      mutateVersions();
      setIsLockModalOpen(false);
      setVersionToProcess(null);
    } catch (error: any) {
      // --- THIS IS THE ERROR HANDLING ---
      if (error.response?.status === 400 && error.response.data.status) {
        // Specific validation error from Django!
        setErrorRow({
          id: versionToProcess.id,
          message: error.response.data.status[0],
        });
      } else {
        // Generic error
        setErrorRow({
          id: versionToProcess.id,
          message: "An unexpected error occurred. Please try again.",
        });
      }
      setIsLockModalOpen(false); // Close modal to show the error on the row
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmActivate = async () => {
    if (!versionToProcess) return;

    setActionLoadingId(versionToProcess.id);
    setErrorRow(null);
    try {
      await activateVersion(versionToProcess.id);
      mutateVersions();
      setIsActivateModalOpen(false);
      setVersionToProcess(null);
    } catch (error: any) {
      setErrorRow({
        id: versionToProcess.id,
        message: "Failed to activate version. Please try again.",
      });
      setIsActivateModalOpen(false);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!versionToProcess) return;

    setActionLoadingId(versionToProcess.id);
    setErrorRow(null);
    try {
      await deleteVersion(versionToProcess.id);
      mutateVersions();
      setIsDeleteModalOpen(false);
      setVersionToProcess(null);
    } catch (error: any) {
      setErrorRow({
        id: versionToProcess.id,
        message: "Failed to delete version. Please try again.",
      });
      setIsDeleteModalOpen(false);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClone = async (versionId: number) => {
    setActionLoadingId(versionId);
    setErrorRow(null);
    try {
      await createNewVersionFromExisting(versionId);
      mutateVersions();
    } catch (error: any) {
      setErrorRow({
        id: versionId,
        message: "Failed to clone version. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
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
        onSuccess={handleCreateSuccess} // ✅ Use the fixed handler
      />
      <ConfirmLockModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        onConfirm={handleConfirmLock}
        versionName={versionToProcess?.version_name}
      />
      <ConfirmActivateModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
        onConfirm={handleConfirmActivate}
        versionName={versionToProcess?.version_name}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        versionName={versionToProcess?.version_name}
      />

      <div className="space-y-6">
        <VersionListHeader
          product={product}
          onAddNew={() => setIsCreateModalOpen(true)}
          canManage={canManageVersions}
        />
       <VersionGrid
          versions={versions}
          productId={product.id}
          isListLoading={isLoading} // Renamed for clarity (for skeletons)
          actionLoadingId={actionLoadingId} // For row buttons
          errorRow={errorRow} // The error object
          onLock={openLockModal}
          onActivate={openActivateModal}
          onClone={handleClone}
          onDelete={openDeleteModal}
          onClearError={() => setErrorRow(null)} // Handler to clear error
          canManage={canManageVersions}
        />
      </div>
    </>
  );
}