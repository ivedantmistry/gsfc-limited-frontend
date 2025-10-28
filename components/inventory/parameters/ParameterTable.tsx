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
            <TableHead>Data Type</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-center">Required</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.map((param) => (
            <TableRow key={param.id}>
              <TableCell className="font-medium">{param.name}</TableCell>
              <TableCell className="font-mono text-sm">
                {param.data_type}
              </TableCell>
              <TableCell>{param.unit || "N/A"}</TableCell>
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