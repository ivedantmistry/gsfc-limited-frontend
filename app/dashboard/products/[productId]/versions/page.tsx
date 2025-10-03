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
import { VersionTable } from "@/components/inventory/versions/VersionTable";
import { ConfirmLockModal } from "@/components/modals/ConfirmLockModal";
import { ConfirmActivateModal } from "@/components/modals/ConfirmActivateModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { Version } from "@/lib/types";
import { useHasPermission } from "@/hooks/useHasPermission";

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

  const openLockModal = (versionId: number) => {
    const version = versions?.find((v) => v.id === versionId);
    if (version) {
      setVersionToProcess(version);
      setIsLockModalOpen(true);
    }
  };
  const openActivateModal = (versionId: number) => {
    const version = versions?.find((v) => v.id === versionId);
    if (version) {
      setVersionToProcess(version);
      setIsActivateModalOpen(true);
    }
  };
  const openDeleteModal = (versionId: number) => {
    const version = versions?.find((v) => v.id === versionId);
    if (version) {
      setVersionToProcess(version);
      setIsDeleteModalOpen(true);
    }
  };
  const handleCreate = async (versionName: string) => {
    await createVersion({
      product: Number(productId),
      version_name: versionName,
    });
    mutateVersions();
    setIsCreateModalOpen(false);
  };
  const handleConfirmLock = async () => {
    if (!versionToProcess) return;
    await lockVersion(versionToProcess.id);
    mutateVersions();
    setIsLockModalOpen(false);
  };
  const handleConfirmActivate = async () => {
    if (!versionToProcess) return;
    await activateVersion(versionToProcess.id);
    mutateVersions();
    setIsActivateModalOpen(false);
  };
  const handleConfirmDelete = async () => {
    if (!versionToProcess) return;
    await deleteVersion(versionToProcess.id);
    mutateVersions();
    setIsDeleteModalOpen(false);
  };
  const handleClone = async (versionId: number) => {
    await createNewVersionFromExisting(versionId);
    mutateVersions();
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
        <VersionTable
          versions={versions}
          productId={product.id}
          isLoading={isLoading}
          onLock={openLockModal}
          onActivate={openActivateModal}
          onClone={handleClone}
          onDelete={openDeleteModal}
          canManage={canManageVersions} 
        />
      </div>
    </>
  );
}
