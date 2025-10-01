import React from "react";
import { ParameterDefinition } from "@/lib/types";

export const ParameterTable = ({
  parameters,
}: {
  parameters: ParameterDefinition[];
}) => (
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
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
