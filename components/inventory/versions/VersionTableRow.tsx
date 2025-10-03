// src/components/inventory/versions/VersionTableRow.tsx

import React from "react";
import Link from "next/link";
import { Version } from "@/lib/types";
import { VersionActions } from "./VersionActions";
import { ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge"; // ✅ Import Badge
import { TableRow, TableCell } from "@/components/ui/table"; // ✅ Import Table components

// ✅ Define a helper for status variants
const getStatusVariant = (status: Version['status']) => {
  switch (status) {
    case "DRAFT": return "warning";
    case "LOCKED": return "secondary";
    default: return "secondary";
  }
}

type VersionTableRowProps = {
  version: Version;
  productId: number | string;
  isLoading: boolean;
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  canManage?: boolean;
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
}) => {
  return (
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
        {/* ✅ Use the Badge component with our custom CSS classes */}
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
  );
};