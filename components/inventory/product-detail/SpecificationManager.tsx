"use client";

import React from "react";
import {
  useSpecifications,
  activateSpecification,
  createNewSpecificationVersion,
  createSpecification,
} from "@/lib/api/products";
import { ParameterDefinition } from "@/lib/types";
import { FileCheck2, Copy, AlertTriangle } from "lucide-react";

export function SpecificationManager({
  productId,
  directParameters,
}: {
  productId: number | string;
  directParameters: ParameterDefinition[];
}) {
  const { specifications, isLoading, mutate } = useSpecifications({
    productId,
  });

  const handleActivate = async (specId: number) => {
    try {
      await activateSpecification(specId);
      mutate(); // Re-fetch the list to show the change
    } catch (error) {
      console.error("Failed to activate specification:", error);
      // You could add a user-facing error message here
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

  // NEW: Function to handle creating the very first specification
  const handleCreateFirstSpecification = async () => {
    // Use a simple confirmation before creating
    if (
      !window.confirm(
        "This will create Specification v1 using all current direct parameters. Are you sure?"
      )
    ) {
      return;
    }

    try {
      // Prepare the payload for the API
      const payload = {
        name: "v1.0 - Initial Release",
        product: productId,
        parameter_ids: directParameters.map((p) => p.id), // Get IDs from the passed-in parameters
      };
      await createSpecification(payload);
      mutate(); // Re-fetch the list to show the new spec
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
          This product has no defined testing specifications yet.
        </p>
        {/* REVAMPED: The button now calls our new handler function */}
        <button
          onClick={handleCreateFirstSpecification}
          disabled={!directParameters || directParameters.length === 0}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-800 text-white font-medium px-4 py-2 text-sm hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Create Specification v1
        </button>
        {(!directParameters || directParameters.length === 0) && (
          <p className="text-xs text-slate-400 mt-2">
            Add direct parameters to the product before creating a
            specification.
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
            className="inline-flex items-center gap-2 rounded-md bg-white text-slate-800 font-medium px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100/80"
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
                <p className="text-xs text-slate-500">
                  Contains {spec.parameters.length} parameters
                </p>
              </div>
            </div>
            {spec.is_active ? (
              <span className="px-3 py-1 text-xs font-bold text-white bg-indigo-500 rounded-full">
                ACTIVE
              </span>
            ) : (
              <button
                onClick={() => handleActivate(spec.id)}
                className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300"
              >
                Set as Active
              </button>
            )}
          </div>
          {/* Optional: Add a dropdown to view the parameters for each spec */}
        </div>
      ))}
    </div>
  );
}
