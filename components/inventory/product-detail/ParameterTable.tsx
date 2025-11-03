// /components/inventory/product-detail/ParameterTable.tsx
import { ParameterDefinition } from "@/lib/types";

interface ParameterTableProps {
  parameters: ParameterDefinition[];
  onEdit?: (param: ParameterDefinition) => void;
}

export const ParameterTable = ({ parameters, onEdit }: ParameterTableProps) => (
  <div className="overflow-hidden rounded-lg border border-slate-200">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th
            scope="col"
            className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
          >
            Name
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
          >
            Unit
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
          >
            Min Value
          </th>
          <th
            scope="col"
            className="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
          >
            Max Value
          </th>
          {onEdit && (
            <th scope="col" className="relative px-4 py-2">
              <span className="sr-only">Edit</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-200">
        {parameters.map((param) => (
          <tr key={param.id}>
            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-800">
              {param.name}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">
              {param.unit || "N/A"}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">
              {param.min_value || "N/A"}
            </td>
            <td className="px-4 py-2 whitespace-nowrowrap text-sm text-slate-600">
              {param.max_value || "N/A"}
            </td>
            {onEdit && (
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(param)}
                  className="text-indigo-600 hover:text-indigo-900 text-xs"
                >
                  Edit
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
