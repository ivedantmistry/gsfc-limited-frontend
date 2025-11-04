"use client";

import React, { useState, use } from "react";
import { useProduct } from "@/lib/api/product";
import {
  useVersions,
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

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [errorRow, setErrorRow] = useState<{
    id: number;
    message: string;
  } | null>(null);

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

  const handleCreateSuccess = () => {
    mutateVersions();
    setIsCreateModalOpen(false);
  };

  const handleConfirmLock = async () => {
    if (!versionToProcess) return;

    setActionLoadingId(versionToProcess.id);
    setErrorRow(null);

    try {
      await lockVersion(versionToProcess.id);
      mutateVersions();
      setIsLockModalOpen(false);
      setVersionToProcess(null);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object"
      ) {
        const response = (
          error as {
            response?: { status?: number; data?: { status?: string[] } };
          }
        ).response;

        if (response?.status === 400 && response.data?.status?.[0]) {
          setErrorRow({
            id: versionToProcess.id,
            message: response.data.status[0],
          });
          setIsLockModalOpen(false);
          setActionLoadingId(null);
          return;
        }
      }

      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      setErrorRow({
        id: versionToProcess.id,
        message,
      });
      setIsLockModalOpen(false);
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
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to activate version. Please try again.";

      setErrorRow({
        id: versionToProcess.id,
        message,
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
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete version. Please try again.";

      setErrorRow({
        id: versionToProcess.id,
        message,
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
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to clone version. Please try again.";

      setErrorRow({
        id: versionId,
        message,
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
      {/* Modals */}
      <CreateVersionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        productId={productId}
        onSuccess={handleCreateSuccess}
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

      {/* Page Content */}
      <div className="space-y-6">
        {/* Header */}
        <VersionListHeader
          product={product}
          onAddNew={() => setIsCreateModalOpen(true)}
          canManage={canManageVersions}
        />

        {/* Version Grid */}
        <VersionGrid
          versions={versions}
          productId={product.id}
          isListLoading={isLoading}
          actionLoadingId={actionLoadingId}
          errorRow={errorRow}
          onLock={openLockModal}
          onActivate={openActivateModal}
          onClone={handleClone}
          onDelete={openDeleteModal}
          onClearError={() => setErrorRow(null)}
          canManage={canManageVersions}
        />
      </div>
    </>
  );
}
