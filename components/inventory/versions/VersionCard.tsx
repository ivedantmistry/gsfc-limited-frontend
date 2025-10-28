"use client";

import React from "react";
import Link from "next/link";
import { Version } from "@/lib/types";
import { VersionActions } from "./VersionActions";
import { ShieldCheck, AlertCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const getStatusVariant = (status: Version["status"]) => {
  switch (status) {
    case "DRAFT":
      return "warning";
    case "LOCKED":
      return "secondary";
    default:
      return "secondary";
  }
};

type VersionCardProps = {
  version: Version;
  productId: number | string;
  isLoading: boolean;
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  canManage?: boolean;
  error: string | null;
  onClearError: () => void;
};

export const VersionCard: React.FC<VersionCardProps> = ({
  version,
  productId,
  isLoading,
  onLock,
  onActivate,
  onClone,
  onDelete,
  canManage,
  error,
  onClearError,
}) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm flex flex-col justify-between">
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Link
            href={`/dashboard/products/${productId}/versions/${version.id}`}
            className="text-lg font-semibold text-indigo-600 hover:underline"
            title={version.description || version.version_name}
          >
            {version.version_name}
          </Link>
          <div className="flex items-center gap-2">
            {version.is_active && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ShieldCheck size={12} /> Active
              </span>
            )}
            <Badge
              className={`badge-${getStatusVariant(version.status)}`}
              variant="outline"
            >
              {version.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      {canManage && (
        <div className="p-4 bg-slate-50 border-t rounded-b-lg">
          <VersionActions
            version={version}
            isLoading={isLoading}
            onLock={onLock}
            onActivate={onActivate}
            onClone={onClone}
            onDelete={onDelete}
            canManage={canManage}
          />
        </div>
      )}

      {error && (
        <div className="p-4 border-t border-red-200">
          <Alert variant="destructive" className="relative">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearError}
              className="absolute top-1 right-1 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        </div>
      )}
    </div>
  );
};

export const VersionCardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t rounded-b-lg">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
};