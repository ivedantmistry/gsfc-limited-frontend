"use client";

import React, { useState } from "react";
// UPDATED: Import the new, correct API hooks and functions
import {
  useVersions,
  activateVersion,
  createNewVersionFromExisting,
  createVersion,
  lockVersion,
} from "@/lib/api/version";
// UPDATED: Import the new Version type
import { Version } from "@/lib/types/";
import { FileCheck2, Copy, AlertTriangle, Lock, Unlock } from "lucide-react";
// This modal will also need an update, but we'll focus on this component for now.
import { CreateVersionModal } from "@/components/inventory/CreateVersionModal"; // Assuming this is renamed

// RENAMED: Component and props are updated and simplified
export function VersionManager({ productId }: { productId: number | string }) {
  // UPDATED: Using the new useVersions hook
  const { versions, isLoading, mutate } = useVersions(productId);

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
      // UPDATED: Calling the new lockVersion function
      await lockVersion(versionId);
      mutate();
    } catch (error) {
      console.error("Failed to lock version:", error);
    }
  };

  const handleActivate = async (versionId: number) => {
    try {
      // UPDATED: Calling the new activateVersion function
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

  // SIMPLIFIED: The create logic is much cleaner now
  const handleConfirmCreate = async (versionName: string) => {
    try {
      if (isVersioning) {
        const activeVersion = versions?.find((v) => v.is_active);
        if (activeVersion) {
          await createNewVersionFromExisting(activeVersion.id);
        }
      } else {
        // The new API only needs the product ID and version name
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

  // RENAMED: 'specifications' is now 'versions'
  const activeVersion = versions?.find((v) => v.is_active);

  if (!versions || versions.length === 0) {
    return (
      <>
        {/* You will need to update or rename this modal component as well */}
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
          <button onClick={handleCreateFirstVersion} className="mt-4 ...">
            Create First Version
          </button>
        </div>
      </>
    );
  }

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
            <button onClick={handleCreateNewVersion} className="...">
              <Copy size={16} /> Create New Version
            </button>
          )}
        </div>

        {/* RENAMED: Mapping over 'versions' and using 'version' */}
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-4 rounded-lg border ${
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
                    {/* UPDATED: Using version_name */}
                    {version.version_name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {version.status === "DRAFT" ? (
                      <Unlock size={12} />
                    ) : (
                      <Lock size={12} />
                    )}
                    <span>{version.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {version.status === "DRAFT" && (
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
          </div>
        ))}
      </div>
    </>
  );
}