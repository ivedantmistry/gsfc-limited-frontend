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
  isLoading: boolean;
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  canManage?: boolean;
};

export const VersionTable: React.FC<VersionTableProps> = ({
  versions,
  productId,
  isLoading,
  onLock,
  onActivate,
  onClone,
  onDelete,
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
          {isLoading && (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                {canManage && <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>}
              </TableRow>
            ))
          )}
          {!isLoading && versions && versions.length > 0 ? (
            versions.map((version) => (
              <VersionTableRow
                key={version.id}
                version={version}
                productId={productId}
                isLoading={isLoading} // isLoading is always false here, but we pass for prop conformity
                onLock={onLock}
                onActivate={onActivate}
                onClone={onClone}
                onDelete={onDelete}
                canManage={canManage}
              />
            ))
          ) : (
            !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={canManage ? 4 : 3}
                  className="h-24 text-center"
                >
                  No versions found for this product.
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};