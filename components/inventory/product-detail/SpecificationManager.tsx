"use client";

import React, { useState } from "react";
import {
  useSpecifications,
  activateSpecification,
  createNewSpecificationVersion,
  createSpecification,
  lockSpecification,
} from "@/lib/api/product";
import { ParameterDefinition } from "@/lib/types";
import { FileCheck2, Copy, AlertTriangle, Lock, Unlock } from "lucide-react";
import { CreateSpecificationModal } from "@/components/inventory/CreateSpecificationModal";

export function SpecificationManager({
  scope,
  availableParameters,
}: {
  scope: { productId?: number | string; gradeId?: number | string };
  availableParameters: ParameterDefinition[];
}) {
  const { specifications, isLoading, mutate } = useSpecifications(scope);
  // NEW: State to control the creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // NEW: State to track if we're creating a new version of an existing spec
  const [isVersioning, setIsVersioning] = useState(false);

  const handleLock = async (specId: number) => {
    if (
      !window.confirm(
        "Locking a specification is permanent and cannot be undone. Are you sure?"
      )
    )
      return;
    try {
      await lockSpecification(specId);
      mutate();
    } catch (error) {
      console.error("Failed to lock specification:", error);
    }
  };

  const handleActivate = async (specId: number) => {
    try {
      await activateSpecification(specId);
      mutate(); // Re-fetch the list to show the change
    } catch (error) {
      console.error("Failed to activate specification:", error);
    }
  };

  const handleCreateNewVersion = () => {
    setIsVersioning(true);
    setIsCreateModalOpen(true);
  };

  const handleCreateFirstSpec = () => {
    setIsVersioning(false);
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreate = async (name: string) => {
    try {
      if (isVersioning) {
        const activeSpec = specifications?.find((s) => s.is_active);
        if (activeSpec) {
          // This API call needs to be updated to accept a name.
          // For now, the backend auto-generates it.
          await createNewSpecificationVersion(activeSpec.id);
        }
      } else {
        const payload = {
          name,
          product: scope.productId,
          product_grade: scope.gradeId,
          parameter_ids: availableParameters.map((p) => p.id),
        };
        await createSpecification(payload);
      }
      mutate(); // Re-fetch the list to show the new spec
    } catch (error) {
      console.error("Failed to create specification:", error);
      alert(
        "Error: Could not create the specification. Check console for details."
      );
    } finally {
      setIsCreateModalOpen(false);
      setIsVersioning(false);
    }
  };
  if (isLoading) {
    return <div className="h-48 bg-slate-200 rounded-lg animate-pulse"></div>;
  }
  const activeSpec = specifications?.find((s) => s.is_active);
  // NEW: Dynamically calculate the next version number
  const nextVersionNumber =
    specifications && specifications.length > 0
      ? Math.max(...specifications.map((s) => s.version)) + 1
      : 1;

  if (!specifications || specifications.length === 0) {
    return (
      <>
        <CreateSpecificationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleConfirmCreate}
          parametersToLock={availableParameters}
          nextVersionNumber={nextVersionNumber}
        />
        <div className="text-center p-8 bg-white/80 rounded-xl border border-slate-200/70">
          <AlertTriangle className="mx-auto w-12 h-12 text-slate-400" />
          <p className="mt-4 font-semibold text-slate-700">
            No Specifications Found
          </p>
          <p className="text-sm text-slate-500">
            This item has no defined testing specifications yet.
          </p>
          <button
            onClick={handleCreateFirstSpec}
            disabled={!availableParameters || availableParameters.length === 0}
            className="mt-4 ..."
          >
            Create Specification v1
          </button>
          {(!availableParameters || availableParameters.length === 0) && (
            <p className="text-xs text-slate-400 mt-2">
              Add parameters before creating a specification.
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <CreateSpecificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleConfirmCreate}
        // If versioning, use the active spec's params. Otherwise, use available params.
        parametersToLock={
          isVersioning && activeSpec
            ? activeSpec.parameters
            : availableParameters
        }
        nextVersionNumber={nextVersionNumber}
      />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Specifications</h2>
          {activeSpec && (
            <button onClick={handleCreateNewVersion} className="...">
              <Copy size={16} /> Create New Version
            </button>
          )}
        </div>

        {specifications.map((spec) => (
          <div
            key={spec.id}
            className={`p-4 rounded-lg border ${
              spec.is_active
                ? "bg-indigo-50 border-indigo-300"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileCheck2
                  className={`w-6 h-6 ${
                    spec.is_active ? "text-indigo-600" : "text-slate-500"
                  }`}
                />
                <div>
                  <p className="font-bold text-slate-800">
                    {spec.name} (v{spec.version})
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {spec.status === "DRAFT" ? (
                      <Unlock size={12} />
                    ) : (
                      <Lock size={12} />
                    )}
                    <span>{spec.status}</span>
                    <span>&bull;</span>
                    <span>{spec.parameters.length} parameters</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {spec.status === "DRAFT" && (
                  <button
                    onClick={() => handleLock(spec.id)}
                    className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-200 rounded-full hover:bg-amber-300"
                  >
                    Lock Version
                  </button>
                )}
                {spec.status === "LOCKED" && !spec.is_active && (
                  <button
                    onClick={() => handleActivate(spec.id)}
                    className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300"
                  >
                    Set as Active
                  </button>
                )}
                {spec.is_active && (
                  <span className="px-3 py-1 text-xs font-bold text-white bg-indigo-500 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
