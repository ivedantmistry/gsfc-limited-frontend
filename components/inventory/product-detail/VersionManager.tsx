"use client";

import React, { useState } from "react";
import {
  activateVersion,
  createNewVersionFromExisting,
  createVersion,
  lockVersion,
} from "@/lib/api/version";
import { VersionNested } from "@/lib/types";
import {
  FileCheck2,
  Copy,
  AlertTriangle,
  Lock,
  Unlock,
  Plus,
} from "lucide-react";
import { CreateVersionModal } from "@/components/inventory/CreateVersionModal";
import { ParameterTable } from "./ParameterTable";
import { EmptyState } from "./EmptyState";
import { GradeCard } from "./GradeCard";

// ✅ Correct prop type
interface VersionManagerProps {
  productId: number | string;
  versions: VersionNested[];
  isLoading: boolean;
  mutate: () => void;
  // This now correctly allows either a versionId or a gradeId
  openParamModal: (scope: { versionId?: number; gradeId?: number }) => void;
  openGradeModal: (versionId: number) => void;
}
export function VersionManager({
  productId,
  versions,
  isLoading,
  mutate,
  openParamModal,
  openGradeModal,
}: VersionManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVersioning, setIsVersioning] = useState(false);

  const handleLock = async (versionId: number) => {
    if (
      !window.confirm(
        "Locking a version is permanent and cannot be undone. Are you sure?"
      )
    )
      return;
    try {
      await lockVersion(versionId);
      mutate();
    } catch (error) {
      console.error("Failed to lock version:", error);
    }
  };

  const handleActivate = async (versionId: number) => {
    try {
      await activateVersion(versionId);
      mutate();
    } catch (error) {
      console.error("Failed to activate version:", error);
    }
  };

  const handleCreateNewVersion = () => {
    setIsVersioning(true);
    setIsCreateModalOpen(true);
  };

  const handleCreateFirstVersion = () => {
    setIsVersioning(false);
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = async (versionName: string) => {
    try {
      if (isVersioning) {
        const activeVersion = versions?.find((v) => v.is_active);
        if (activeVersion) {
          await createNewVersionFromExisting(activeVersion.id);
        }
      } else {
        const payload = {
          product: Number(productId),
          version_name: versionName,
        };
        await createVersion(payload);
      }
      mutate();
    } catch (error) {
      console.error("Failed to create version:", error);
      alert("Error: Could not create the version. Check console for details.");
    } finally {
      setIsCreateModalOpen(false);
      setIsVersioning(false);
    }
  };

  if (isLoading) {
    return <div className="h-48 bg-slate-200 rounded-lg animate-pulse"></div>;
  }

  const activeVersion = versions?.find((v) => v.is_active);

  if (!versions || versions.length === 0) {
    return (
      <>
        <CreateVersionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleConfirmCreate}
        />
        <div className="text-center p-8 bg-white/80 rounded-xl border border-slate-200/70">
          <AlertTriangle className="mx-auto w-12 h-12 text-slate-400" />
          <p className="mt-4 font-semibold text-slate-700">No Versions Found</p>
          <p className="text-sm text-slate-500">
            This product has no defined testing versions yet.
          </p>
          <button
            onClick={handleCreateFirstVersion}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            <Plus size={16} /> Create First Version
          </button>
        </div>
      </>
    );
  }
  const gradeColors = ["sky", "teal", "rose", "amber", "violet"];
  return (
    <>
      <CreateVersionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleConfirmCreate}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Versions</h2>
          {activeVersion && (
            <button
              onClick={handleCreateNewVersion}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md"
            >
              <Copy size={16} /> Create New Version
            </button>
          )}
        </div>

        {versions.map((version) => {
          const isDraft = version.status === "DRAFT";
          const hasParameters = version.parameters.length > 0;
          const hasGrades = version.grades.length > 0;
          const isEmptyDraft = isDraft && !hasParameters && !hasGrades;

          return (
            <div
              key={version.id}
              className={`p-4 rounded-lg border space-y-4 ${
                version.is_active
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileCheck2
                    className={`w-6 h-6 ${
                      version.is_active ? "text-indigo-600" : "text-slate-500"
                    }`}
                  />
                  <div>
                    <p className="font-bold text-slate-800">
                      {version.version_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {isDraft ? <Unlock size={12} /> : <Lock size={12} />}
                      <span>{version.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDraft && (
                    <button
                      onClick={() => handleLock(version.id)}
                      className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-200 rounded-full hover:bg-amber-300"
                    >
                      Lock Version
                    </button>
                  )}
                  {version.status === "LOCKED" && !version.is_active && (
                    <button
                      onClick={() => handleActivate(version.id)}
                      className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300"
                    >
                      Set as Active
                    </button>
                  )}
                  {version.is_active && (
                    <span className="px-3 py-1 text-xs font-bold text-white bg-indigo-500 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 p-4 space-y-4">
                {isEmptyDraft ? (
                  <EmptyState
                    onAddGradeClick={() => openGradeModal(version.id)}
                    onAddParameterClick={() =>
                      openParamModal({ versionId: version.id })
                    }
                  />
                ) : hasParameters ? (
                  <>
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-slate-700">
                        Parameters
                      </h4>
                      {isDraft && (
                        <button
                          onClick={() =>
                            openParamModal({ versionId: version.id })
                          }
                          className="..."
                        >
                          <Plus size={14} /> Add Parameter
                        </button>
                      )}
                    </div>
                    <ParameterTable parameters={version.parameters} />
                  </>
                ) : hasGrades ? (
                  // ✅ NEW: Render the actual grades here
                  <>
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-slate-700">
                        Product Grades
                      </h4>
                      {isDraft && (
                        <button
                          onClick={() => openGradeModal(version.id)}
                          className="..."
                        >
                          <Plus size={14} /> Add Grade
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {version.grades.map(
                        (
                          grade,
                          index // 👈 Get index here
                        ) => (
                          <GradeCard
                            key={grade.id}
                            grade={grade}
                            // ✅ PASS THE COLOR PROP
                            color={gradeColors[index % gradeColors.length]}
                            onAddParameter={() =>
                              openParamModal({ gradeId: grade.id })
                            }
                          />
                        )
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
