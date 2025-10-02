// src/components/records/ResultsTable.tsx

import React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TestResultDisplay } from "@/lib/types/test.types";

interface ResultsTableProps {
  results: TestResultDisplay[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
       <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-slate-800">Test Results</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parameter</TableHead>
            <TableHead>Expected Range</TableHead>
            <TableHead>Actual Result</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.parameter.name}</TableCell>
              <TableCell>
                {result.parameter.min_value && result.parameter.max_value
                  ? `${result.parameter.min_value} - ${result.parameter.max_value} ${result.parameter.unit || ''}`
                  : "N/A"}
              </TableCell>
              <TableCell>{result.display_value}</TableCell>
              <TableCell className="text-right">
                <Badge variant={result.status === "IN_SPEC" ? "default" : "destructive"}>
                  {result.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}