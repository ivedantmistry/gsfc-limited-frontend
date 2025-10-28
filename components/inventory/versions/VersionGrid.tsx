"use client";

import React from "react";
import { Version } from "@/lib/types";
import { VersionCard, VersionCardSkeleton } from "./VersionCard";

// The props are identical to VersionTableProps
type VersionGridProps = {
  versions: Version[] | undefined;
  productId: number | string;
  isListLoading: boolean;
  actionLoadingId: number | null;
  errorRow: { id: number; message: string } | null;
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  onClearError: () => void;
  canManage?: boolean;
};

export const VersionGrid: React.FC<VersionGridProps> = ({
  versions,
  productId,
  isListLoading,
  actionLoadingId,
  errorRow,
  onLock,
  onActivate,
  onClone,
  onDelete,
  onClearError,
  canManage,
}) => {
  // Loading State
  if (isListLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <VersionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty State
  if (!versions || versions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-500">
          No versions found for this product.
        </p>
      </div>
    );
  }

  // Data State
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {versions.map((version) => (
        <VersionCard
          key={version.id}
          version={version}
          productId={productId}
          isLoading={actionLoadingId === version.id}
          error={errorRow?.id === version.id ? errorRow.message : null}
          onClearError={onClearError}
          onLock={onLock}
          onActivate={onActivate}
          onClone={onClone}
          onDelete={onDelete}
          canManage={canManage}
        />
      ))}
    </div>
  );
};