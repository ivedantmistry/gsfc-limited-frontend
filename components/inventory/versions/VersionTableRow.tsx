// src/components/inventory/versions/VersionTableRow.tsx

import React from "react";
import Link from "next/link";
import { Version } from "@/lib/types";
import { VersionActions } from "./VersionActions";
import { ShieldCheck, AlertCircle, X } from "lucide-react"; // ✅ Import icons
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
// ✅ 1. Import Alert components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const getStatusVariant = (status: Version["status"]) => {
  switch (status) {
    case "DRAFT": return "warning";
    case "LOCKED": return "secondary";
    default: return "secondary";
  }
};

type VersionTableRowProps = {
  version: Version;
  productId: number | string;
  isLoading: boolean; // This is now per-row
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  canManage?: boolean;
  // ✅ 2. Add error and clear props
  error: string | null;
  onClearError: () => void;
};

export const VersionTableRow: React.FC<VersionTableRowProps> = ({
  version,
  productId,
  isLoading,
  onLock,
  onActivate,
  onClone,
  onDelete,
  canManage,
  // ✅ 3. Receive the props
  error,
  onClearError,
}) => {
  // Calculate colSpan for the error row
  const colSpan = canManage ? 4 : 3;

  return (
    // ✅ 4. Wrap in React.Fragment
    <React.Fragment>
      <TableRow>
        <TableCell className="font-medium">
          <Link
            href={`/dashboard/products/${productId}/versions/${version.id}`}
            className="text-indigo-600 hover:underline"
          >
            {version.version_name}
          </Link>
          {version.is_active && (
            <span className="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <ShieldCheck size={12} /> Active
            </span>
          )}
        </TableCell>
        <TableCell>
          <Badge className={`badge-${getStatusVariant(version.status)}`} variant="outline">
            {version.status}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-slate-500">
          {version.created_at ? format(new Date(version.created_at), "dd MMM yyyy") : 'N/A'}
        </TableCell>
        {canManage && (
          <TableCell className="text-right">
            <VersionActions
              version={version}
              isLoading={isLoading}
              onLock={onLock}
              onActivate={onActivate}
              onClone={onClone}
              onDelete={onDelete}
              canManage={canManage}
            />
          </TableCell>
        )}
      </TableRow>

      {/* ✅ 5. Conditionally render the error row */}
      {error && (
        <TableRow>
          <TableCell
            colSpan={colSpan}
            className="py-2 px-4 !pb-4" // Add padding
          >
            <Alert variant="destructive" className="relative">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Locking Version</AlertTitle>
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
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};