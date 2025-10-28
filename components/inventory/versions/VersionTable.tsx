// src/components/inventory/versions/VersionTable.tsx

import React from "react";
import { Version } from "@/lib/types";
import { VersionTableRow } from "./VersionTableRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type VersionTableProps = {
  versions: Version[] | undefined;
  productId: number | string;
  isListLoading: boolean; // ✅ Renamed for clarity
  actionLoadingId: number | null; // ✅ NEW: Tracks which row is loading
  errorRow: { id: number; message: string } | null; // ✅ NEW: Tracks error
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  onClearError: () => void; // ✅ NEW: Handler to clear error
  canManage?: boolean;
};

export const VersionTable: React.FC<VersionTableProps> = ({
  versions,
  productId,
  isListLoading, // ✅ Use the renamed prop
  actionLoadingId, // ✅ Receive new prop
  errorRow, // ✅ Receive new prop
  onLock,
  onActivate,
  onClone,
  onDelete,
  onClearError, // ✅ Receive new prop
  canManage,
}) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created On</TableHead>
            {canManage && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isListLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          {!isListLoading && versions && versions.length > 0
            ? versions.map((version) => (
                <VersionTableRow
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
              ))
            : !isListLoading && (
                <TableRow>
                  <TableCell
                    colSpan={canManage ? 4 : 3}
                    className="h-24 text-center"
                  >
                    No versions found for this product.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );
};
