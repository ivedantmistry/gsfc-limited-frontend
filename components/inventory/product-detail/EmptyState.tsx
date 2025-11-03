// /components/inventory/product-detail/EmptyState.tsx
import { Layers, FlaskConical } from "lucide-react";

interface EmptyStateProps {
  onAddGradeClick: () => void;
  onAddParameterClick: () => void;
}

export const EmptyState = ({
  onAddGradeClick,
  onAddParameterClick,
}: EmptyStateProps) => (
  <div className="text-center bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-300">
    <h3 className="text-md font-semibold text-slate-800">
      Define Your Blueprint
    </h3>
    <p className="mt-1 text-sm text-slate-500">
      How should this version be structured?
    </p>
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button
        onClick={onAddGradeClick}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
      >
        <Layers className="w-6 h-6 text-indigo-600 mb-1" />
        <span className="font-semibold text-sm text-slate-700">Add Grades</span>
      </button>
      <button
        onClick={onAddParameterClick}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm hover:border-green-500 hover:bg-green-50 transition-colors"
      >
        <FlaskConical className="w-6 h-6 text-green-600 mb-1" />
        <span className="font-semibold text-sm text-slate-700">
          Add Direct Parameters
        </span>
      </button>
    </div>
  </div>
);
