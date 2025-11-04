// src/components/records/ResultsTable.tsx

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TestResultDisplay } from "@/lib/types/test.types";

interface ResultsTableProps {
  results: TestResultDisplay[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-800">Test Results</h3>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700">
              Parameter
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Expected Range
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Actual Result
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {results.length > 0 ? (
            results.map((result) => (
              <TableRow
                key={result.id}
                className="transition-colors hover:bg-slate-50"
              >
                <TableCell className="font-medium text-slate-800">
                  {result.parameter.name}
                </TableCell>
                <TableCell className="text-slate-600">
                  {result.parameter.min_value && result.parameter.max_value
                    ? `${result.parameter.min_value} - ${result.parameter.max_value} ${
                        result.parameter.unit || ""
                      }`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-slate-800">
                  {result.display_value}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`px-2 py-1 text-xs font-semibold rounded-md ${
                      result.status === "IN_SPEC"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {result.status === "IN_SPEC" ? "In Spec" : "Out of Spec"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-slate-500"
              >
                No test results available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
