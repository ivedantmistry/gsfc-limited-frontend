import React from "react";
import { ParameterDefinition } from "@/lib/types/";

interface ParameterTableProps {
  parameters?: ParameterDefinition[];
}

export const ParameterTable = ({ parameters }: ParameterTableProps) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <table className="min-w-full bg-white text-sm">
      <thead className="bg-gray-50 text-left">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-600">Parameter</th>
          <th className="px-4 py-2 font-medium text-gray-600">Unit</th>
          <th className="px-4 py-2 font-medium text-gray-600">Data Type</th>
          <th className="px-4 py-2 font-medium text-gray-600">Range</th>
        </tr>
      </thead>
      <tbody>
        {parameters?.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">{p.name}</td>
            <td className="px-4 py-3 text-gray-500">{p.unit || "N/A"}</td>
            <td className="px-4 py-3 text-gray-500">{p.data_type}</td>
            <td className="px-4 py-3 font-mono text-xs">
              {p.min_value} - {p.max_value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);