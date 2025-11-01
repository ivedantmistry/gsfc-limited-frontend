"use client";

import React, { useState } from "react";
import {
  Product,
  VersionNested,
  ProductGrade,
  ParameterDefinition,
} from "@/lib/types";
import AddGradeModal from "@/components/modals/AddGradeModal";
import AddParameterModal from "@/components/modals/AddParameterModal";
import EditGradeModal from "@/components/modals/EditGradeModal";
import { VersionHeader } from "./VersionHeader";
import { EmptyState } from "./EmptyState";
import { ParameterSection } from "./ParameterSection";
import { GradeSection } from "./GradeSection";
import { deleteGrade } from "@/lib/api/grade";
import { deleteParameter } from "@/lib/api/parameter";
import DeleteConfirmationDialog from "@/components/modals/DeleteConfirmationDialog";
import { toast } from "sonner";

interface VersionDetailViewProps {
  product: Product;
  version: VersionNested;
  onDataChange: () => void;
  onNameUpdate: (newName: string) => Promise<void>;
  canManage: boolean;
}

export function VersionDetailView({
  version,
  onDataChange,
  onNameUpdate,
  canManage,
}: VersionDetailViewProps) {
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [paramModalScope, setParamModalScope] = useState<{
    versionId?: number;
    gradeId?: number;
  }>({});

  const [editingGrade, setEditingGrade] = useState<ProductGrade | null>(null);
  const [editingParameter, setEditingParameter] =
    useState<ParameterDefinition | null>(null);
  const [deletingParameter, setDeletingParameter] =
    useState<ParameterDefinition | null>(null);
  const [deletingGrade, setDeletingGrade] = useState<ProductGrade | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openGradeModal = () => {
    setIsGradeModalOpen(true);
  };

  const openParamModal = (scope: { versionId?: number; gradeId?: number }) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
  };

  const openEditParamModal = (parameter: ParameterDefinition) => {
    setEditingParameter(parameter);
    setIsParamModalOpen(true);
  };

  const closeParamModal = () => {
    setIsParamModalOpen(false);
    setEditingParameter(null);
  };

  const handleOpenEditGradeModal = (grade: ProductGrade) => {
    setEditingGrade(grade);
  };

  const handleCloseEditGradeModal = () => {
    setEditingGrade(null);
  };
  const handleOpenDeleteModal = (grade: ProductGrade) => {
    setDeletingGrade(grade);
  };

  const handleCloseDeleteModal = () => {
    setDeletingGrade(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGrade) return;

    setIsDeleting(true);
    try {
      await deleteGrade(deletingGrade.id);
      toast.success(`Grade "${deletingGrade.name}" deleted successfully.`);
      onDataChange(); // Re-fetch version data
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Failed to delete grade. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleOpenDeleteParamModal = (parameter: ParameterDefinition) => {
    setDeletingParameter(parameter);
  };

  const handleCloseDeleteParamModal = () => {
    setDeletingParameter(null);
  };

  const handleConfirmDeleteParam = async () => {
    if (!deletingParameter) return;

    setIsDeleting(true);
    try {
      await deleteParameter(deletingParameter.id);
      toast.success(
        `Parameter "${deletingParameter.name}" deleted successfully.`
      );
      onDataChange(); // Re-fetch version data
      handleCloseDeleteParamModal();
    } catch (error) {
      toast.error("Failed to delete parameter. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const parameters = version.parameters ?? [];
  const grades = version.grades ?? [];
  const isDraft = version.status === "DRAFT";
  const hasParameters = parameters.length > 0;
  const hasGrades = grades.length > 0;
  const isEmptyDraft = isDraft && !hasParameters && !hasGrades;

  return (
    <>
      <AddGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        versionId={version.id}
        onSuccess={onDataChange}
      />
      <AddParameterModal
        isOpen={isParamModalOpen}
        onClose={closeParamModal}
        scope={paramModalScope}
        onSuccess={onDataChange}
        editingParameter={editingParameter}
      />

      <EditGradeModal
        isOpen={!!editingGrade}
        onClose={handleCloseEditGradeModal}
        grade={editingGrade}
        versionId={version.id}
      />
      <DeleteConfirmationDialog
        isOpen={!!deletingGrade}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this grade?"
        description={`This will permanently delete the grade "${deletingGrade?.name}". This action cannot be undone.`}
        isDeleting={isDeleting}
      />
      <DeleteConfirmationDialog
        isOpen={!!deletingParameter}
        onClose={handleCloseDeleteParamModal}
        onConfirm={handleConfirmDeleteParam}
        title="Are you sure you want to delete this parameter?"
        description={`This will permanently delete the parameter "${deletingParameter?.name}". This action cannot be undone.`}
        isDeleting={isDeleting}
      />
      <div className="space-y-6">
        <VersionHeader
          version={version}
          isDraft={isDraft}
          onAddGrade={openGradeModal}
          onAddParameter={() => openParamModal({ versionId: version.id })}
          onNameUpdate={onNameUpdate}
        />

        {isEmptyDraft && (
          <EmptyState
            onAddGradeClick={openGradeModal}
            onAddParameterClick={() =>
              openParamModal({ versionId: version.id })
            }
            canManage={canManage}
          />
        )}
      {hasParameters && (
          <ParameterSection
            isDraft={isDraft}
            versionId={version.id}
            parameters={parameters}
            onOpenParamModal={openParamModal}
            canManage={canManage}
            onEditParameter={openEditParamModal}
            onDeleteParameter={handleOpenDeleteParamModal} 
          />
        )}
        {hasGrades && (
          <GradeSection
            isDraft={isDraft}
            versionId={version.id}
            grades={grades}
            onOpenGradeModal={openGradeModal}
            onOpenParamModal={openParamModal}
            canManage={canManage}
            onEditGrade={handleOpenEditGradeModal}
            onDeleteGrade={handleOpenDeleteModal}
            onEditParameter={openEditParamModal}
            onDeleteParameter={handleOpenDeleteParamModal} 
          />
        )}
      </div>
    </>
  );
}
