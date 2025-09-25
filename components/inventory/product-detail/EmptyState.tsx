import React from "react";
import { Layers, FlaskConical } from "lucide-react";

export const EmptyState = () => (
  <div className="text-center bg-gray-50 p-10 rounded-xl border-2 border-dashed border-gray-300">
    <h2 className="text-xl font-semibold text-gray-800">Define Your Product</h2>
    <p className="mt-1 text-sm text-gray-500">
      This product has no parameters or grades yet. Choose how to structure it.
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
