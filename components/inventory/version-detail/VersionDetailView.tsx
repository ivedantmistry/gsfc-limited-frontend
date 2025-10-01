"use client";

import React, { useState } from "react";
import { Product, VersionNested } from "@/lib/types";
import AddGradeModal from "@/components/modals/AddGradeModal";
import AddParameterModal from "@/components/modals/AddParameterModal";

// ✅ FIX: Import the new components that were extracted.
import { VersionHeader } from "./VersionHeader";
import { EmptyState } from "./EmptyState";
import { ParameterSection } from "./ParameterSection";
import { GradeSection } from "./GradeSection";

interface VersionDetailViewProps {
  product: Product;
  version: VersionNested;
  onDataChange: () => void; // Mutate function
}

export function VersionDetailView({
  product,
  version,
  onDataChange,
}: VersionDetailViewProps) {
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [paramModalScope, setParamModalScope] = useState<{
    versionId?: number;
    gradeId?: number;
  }>({});

  const openGradeModal = () => {
    setIsGradeModalOpen(true);
  };

  const openParamModal = (scope: { versionId?: number; gradeId?: number }) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
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
        onClose={() => setIsParamModalOpen(false)}
        scope={paramModalScope}
        onSuccess={onDataChange}
      />

      <div className="space-y-6">
        <VersionHeader
          version={version}
          isDraft={isDraft}
          onAddGrade={openGradeModal}
          onAddParameter={() => openParamModal({ versionId: version.id })}
        />

        {isEmptyDraft && (
          <EmptyState
            onAddGradeClick={openGradeModal}
            onAddParameterClick={() => openParamModal({ versionId: version.id })}
          />
        )}
        {hasParameters && (
          <ParameterSection
            isDraft={isDraft}
            versionId={version.id}
            parameters={parameters}
            onOpenParamModal={openParamModal}
          />
        )}
        {hasGrades && (
          <GradeSection
            isDraft={isDraft}
            versionId={version.id}
            grades={grades}
            onOpenGradeModal={openGradeModal}
            onOpenParamModal={openParamModal}
          />
        )}
      </div>
    </>
  );
}