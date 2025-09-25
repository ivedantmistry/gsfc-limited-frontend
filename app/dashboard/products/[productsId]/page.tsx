"use client";

import React from "react";
import { useProduct, useParameters } from "@/lib/api/products";
import { FlaskConical, Layers, PlusCircle } from "lucide-react";

// You would create these components in separate files for a real app
// For this example, they are included here for simplicity.

const ParameterTable = ({ parameters }: { parameters?: any[] }) => (
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

const GradeParameterView = ({ grade }: { grade: any }) => {
  const { parameters, isLoading } = useParameters({ gradeId: grade.id });

  if (isLoading) return <div>Loading parameters...</div>;

  return (
    <details
      key={grade.name}
      className="group bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      open
    >
      <summary className="flex items-center justify-between p-4 cursor-pointer">
        <h3 className="font-semibold text-gray-900">{grade.name}</h3>
      </summary>
      <div className="border-t border-gray-200">
        <ParameterTable parameters={parameters} />
      </div>
    </details>
  );
};

const EmptyState = () => (
  <div className="text-center bg-gray-50 p-10 rounded-xl border-2 border-dashed border-gray-300">
    <h2 className="text-xl font-semibold text-gray-800">Define Your Product</h2>
    <p className="mt-1 text-sm text-gray-500">
      This product has no parameters or grades yet. Choose how you want to
      structure it.
    </p>
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border shadow-sm hover:border-blue-500 hover:bg-blue-50 transition-colors">
        <Layers className="w-8 h-8 text-blue-600 mb-2" />
        <span className="font-semibold text-gray-800">Add Product Grades</span>
        <span className="text-xs text-gray-500 mt-1">
          For products with multiple quality tiers.
        </span>
      </button>
      <button className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border shadow-sm hover:border-green-500 hover:bg-green-50 transition-colors">
        <FlaskConical className="w-8 h-8 text-green-600 mb-2" />
        <span className="font-semibold text-gray-800">
          Add Direct Parameters
        </span>
        <span className="text-xs text-gray-500 mt-1">
          For products with a single set of specs.
        </span>
      </button>
    </div>
  </div>
);

export default function ProductParametersPage({
  params,
}: {
  params: { productId: string };
}) {
  const { product, isLoading: productLoading } = useProduct(params.productId);
  const { parameters, isLoading: paramsLoading } = useParameters({
    productId: params.productId,
  });

  if (productLoading || paramsLoading) {
    return (
      <div className="bg-gray-100/50 p-6 rounded-xl border border-gray-200 h-64 animate-pulse"></div>
    );
  }

  // Case 1: The product has grades defined.
  if (product && product.grades.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Product Grades
          </h2>
          <button className="inline-flex items-center gap-2 text-sm text-white bg-gray-800 px-3 py-1.5 rounded-md font-medium">
            <PlusCircle size={16} /> Add Grade
          </button>
        </div>
        {product.grades.map((grade) => (
          <GradeParameterView key={grade.id} grade={grade} />
        ))}
      </div>
    );
  }

  // Case 2: The product has no grades, but has direct parameters.
  if (parameters && parameters.length > 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Direct Parameters
          </h2>
          <button className="inline-flex items-center gap-2 text-sm text-white bg-gray-800 px-3 py-1.5 rounded-md font-medium">
            <PlusCircle size={16} /> Add Parameter
          </button>
        </div>
        <ParameterTable parameters={parameters} />
      </div>
    );
  }

  // Case 3: The product is completely empty.
  return <EmptyState />;
}
