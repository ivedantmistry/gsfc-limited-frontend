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
          {/* Change the header to be more generic */}
          <th className="px-4 py-2 font-medium text-gray-600">Constraints / Options</th>
        </tr>
      </thead>
      <tbody>
        {parameters?.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">{p.name}</td>
            <td className="px-4 py-3 text-gray-500">{p.unit || "N/A"}</td>
            <td className="px-4 py-3 text-gray-500">{p.data_type}</td>
            <td className="px-4 py-3">
              {/* --- START: CONDITIONAL RENDERING --- */}

              {/* Show Min/Max for numeric types */}
              {(p.data_type === 'DECIMAL' || p.data_type === 'INTEGER') &&
                (p.min_value || p.max_value) && (
                  <span className="font-mono text-xs text-gray-700">
                    {p.min_value || '?'} - {p.max_value || '?'}
                  </span>
              )}

              {/* Show styled badges for ENUM options */}
              {p.data_type === 'ENUM' && p.enum_options && (
                <div className="flex flex-wrap gap-1">
                  {p.enum_options.map((option) => (
                    <span
                      key={option}
                      className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              )}

              {/* --- END: CONDITIONAL RENDERING --- */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);