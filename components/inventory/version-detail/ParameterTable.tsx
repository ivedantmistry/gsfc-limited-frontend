import React from "react";
import { ParameterDefinition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ParameterTableProps {
  parameters: ParameterDefinition[];
  isDraft: boolean;
  canManage: boolean;
  onEditParameter: (parameter: ParameterDefinition) => void;
  onDeleteParameter: (parameter: ParameterDefinition) => void;
}

export const ParameterTable = ({
  parameters,
  isDraft,
  canManage,
  onEditParameter,
  onDeleteParameter,
}: ParameterTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">
            Name
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">
            Unit
          </th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">
            Range
          </th>
          <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-200">
        {(parameters ?? []).map((param) => (
          <tr key={param.id}>
            <td className="px-4 py-3 text-sm font-medium text-slate-800">
              {param.name}
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
              {param.unit || "N/A"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
              {param.min_value || param.max_value
                ? `${param.min_value || "-"} to ${param.max_value || "-"}`
                : "N/A"}
            </td>
            <td className="px-4 py-3 text-sm text-slate-600 text-right">
              {isDraft && canManage && (
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditParameter(param)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteParameter(param)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
