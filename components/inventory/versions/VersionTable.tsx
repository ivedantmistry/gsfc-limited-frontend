import React from "react";
import { Version } from "@/lib/types";
import { VersionTableRow } from "./VersionTableRow";

type VersionTableProps = {
  versions: Version[] | undefined;
  productId: number | string;
  // Pass all handlers
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
};

export const VersionTable: React.FC<VersionTableProps> = ({
  versions,
  productId,
  ...handlers
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Version Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Created On
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {versions && versions.length > 0 ? (
            versions.map((version) => (
              <VersionTableRow
                key={version.id}
                version={version}
                productId={productId}
                {...handlers}
              />
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-12 text-slate-500">
                No versions found for this product.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};