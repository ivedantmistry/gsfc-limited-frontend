"use client";

import React from "react";
import { ParameterDefinition } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface ParameterTableProps {
  parameters: ParameterDefinition[];
}

export const ParameterTable = ({ parameters }: ParameterTableProps) => {
  /**
   * 🎨 Renders the specific details for a parameter based on its data type.
   * This replaces the generic 'data_type' column.
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
        return `Numeric${unit}`;

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

  if (!parameters || parameters.length === 0) {
    return (
      <div className="text-center p-6 bg-slate-50 rounded-md border-2 border-dashed border-slate-200">
        <p className="text-sm text-slate-500">
          This version has no parameters defined.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parameter Name</TableHead>
            {/* 👇 Replaced "Data Type" and "Unit" with "Specification" */}
            <TableHead>Specification</TableHead>
            <TableHead className="text-center">Required</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.map((param) => (
            <TableRow key={param.id}>
              <TableCell className="font-medium">{param.name}</TableCell>
              {/* 👇 Render the new specification cell */}
              <TableCell className="text-sm">
                {renderSpecification(param)}
              </TableCell>
              <TableCell className="text-center">
                {param.is_required ? (
                  <Check className="w-4 h-4 text-green-600 inline-block" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 inline-block" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};