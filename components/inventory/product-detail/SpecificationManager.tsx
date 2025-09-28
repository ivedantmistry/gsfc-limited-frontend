"use client";

import React from "react";
import {
  useSpecifications,
  activateSpecification,
  createNewSpecificationVersion,
  createSpecification,
  lockSpecification,
} from "@/lib/api/products";
import { ParameterDefinition } from "@/lib/types";
import { FileCheck2, Copy, AlertTriangle, Lock, Unlock } from "lucide-react";

export function SpecificationManager({
  scope,
  availableParameters,
}: {
  scope: { productId?: number | string; gradeId?: number | string };
  availableParameters: ParameterDefinition[];
}) {
  const { specifications, isLoading, mutate } = useSpecifications(scope);

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

  const handleNewVersion = async (specId: number) => {
    try {
      await createNewSpecificationVersion(specId);
      mutate(); // Re-fetch the list to show the new version
    } catch (error) {
      console.error("Failed to create new version:", error);
    }
  };

  const handleCreateFirstSpecification = async () => {
    if (
      !window.confirm(
        "This will create Specification v1 using all current direct parameters. Are you sure?"
      )
    ) {
      return;
    }

    try {
      const payload = {
        name: "v1.0 - Initial Release",
        product: scope.productId,
        product_grade: scope.gradeId,
        parameter_ids: availableParameters.map((p) => p.id),
      };
      await createSpecification(payload);
      mutate();
    } catch (error) {
      console.error("Failed to create specification:", error);
      alert(
        "Error: Could not create the specification. Check the console for details."
      );
    }
  };

  if (isLoading) {
    return <div className="h-48 bg-slate-200 rounded-lg animate-pulse"></div>;
  }
  if (!specifications || specifications.length === 0) {
    return (
      <div className="text-center p-8 bg-white/80 rounded-xl border border-slate-200/70">
        <AlertTriangle className="mx-auto w-12 h-12 text-slate-400" />
        <p className="mt-4 font-semibold text-slate-700">
          No Specifications Found
        </p>
        <p className="text-sm text-slate-500">
          This item has no defined testing specifications yet.
        </p>
        <button
          onClick={handleCreateFirstSpecification}
          disabled={!availableParameters || availableParameters.length === 0}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-800 text-white font-medium px-4 py-2 text-sm hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Create Specification v1
        </button>
        {(!availableParameters || availableParameters.length === 0) && (
          <p className="text-xs text-slate-400 mt-2">
            Add parameters before creating a specification.
          </p>
        )}
      </div>
    );
  }

  const activeSpec = specifications.find((s) => s.is_active);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Specifications</h2>
        {activeSpec && (
          <button
            onClick={() => handleNewVersion(activeSpec.id)}
            className="..."
          >
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
  );
}
