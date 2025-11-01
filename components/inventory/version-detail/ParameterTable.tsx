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

/**
 * 🎨 Renders the specific details for a parameter based on its data type.
 */
const renderSpecification = (param: ParameterDefinition) => {
  // Combine unit logic for numeric types
  const unit = param.unit ? ` ${param.unit}` : "";

  switch (param.data_type) {
    case "INTEGER":
    case "DECIMAL":
      if (param.min_value && param.max_value) {
        return `${param.min_value} - ${param.max_value}${unit}`;
      }
      if (param.min_value) {
        return `> ${param.min_value}${unit}`;
      }
      if (param.max_value) {
        return `< ${param.max_value}${unit}`;
      }
      return `Numeric${unit}`; // Fallback if no range

    case "ENUM":
      // Display enum options as a comma-separated list
      return (
        <span className="font-mono text-xs">
          {param.enum_options?.join(", ") || "No options defined"}
        </span>
      );

    case "BOOLEAN":
      // Use the custom boolean labels
      return (
        <span className="font-mono text-xs">
          {param.boolean_true_label || "True"} /{" "}
          {param.boolean_false_label || "False"}
        </span>
      );

    case "STRING":
      return <span className="text-slate-500">Text</span>;

    default:
      return <span className="text-slate-400">N/A</span>;
  }
};

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
          {/* 👇 --- MODIFIED: Replaced Unit/Range with Specification --- */}
          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">
            Specification
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
            {/* 👇 --- MODIFIED: Render the new specification cell --- */}
            <td className="px-4 py-3 text-sm text-slate-600">
              {renderSpecification(param)}
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