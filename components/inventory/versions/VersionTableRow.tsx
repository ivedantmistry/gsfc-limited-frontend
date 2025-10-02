import React from "react";
import Link from "next/link";
import { Version } from "@/lib/types";
import { VersionActions } from "./VersionActions";
import { Lock, Unlock, ShieldCheck } from "lucide-react";
import { parseISO, format } from "date-fns";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    return "Invalid Date";
  }
};

type VersionTableRowProps = {
  version: Version;
  productId: number | string;
  isLoading: boolean; // ✅ ADD THIS PROP
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
};

export const VersionTableRow: React.FC<VersionTableRowProps> = ({
  version,
  productId,
  isLoading, // ✅ GET THE PROP
  onLock,
  onActivate,
  onClone,
  onDelete,
}) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/dashboard/products/${productId}/versions/${version.id}`}
          className="font-semibold text-indigo-600 hover:underline"
        >
          {version.version_name}
        </Link>
        {version.is_active && (
          <span className="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <ShieldCheck size={12} /> Active
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            version.status === "DRAFT"
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {version.status === "DRAFT" ? (
            <Unlock size={12} />
          ) : (
            <Lock size={12} />
          )}
          {version.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {formatDate(version.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <VersionActions
          version={version}
          isLoading={isLoading} // ✅ PASS IT DOWN
          onLock={onLock}
          onActivate={onActivate}
          onClone={onClone}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};