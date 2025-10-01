"use client";

import React, { useState } from "react";
import {
  Product,
  VersionNested,
  ProductGrade,
  ParameterDefinition,
} from "@/lib/types";
import {
  Plus,
  Lock,
  Unlock,
  ShieldCheck,
  Layers,
  FlaskConical,
} from "lucide-react";
import AddGradeModal from "@/components/modals/AddGradeModal";
import AddParameterModal from "@/components/modals/AddParameterModal";

// ====================================================================
// --- Main View Component ---
// ====================================================================

interface VersionDetailViewProps {
  product: Product;
  version: VersionNested;
  onDataChange: () => void; // Mutate function
}

export function VersionDetailView({
  product,
  version,
  onDataChange,
}: VersionDetailViewProps) {
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [paramModalScope, setParamModalScope] = useState<{
    versionId?: number;
    gradeId?: number;
  }>({});

  const openGradeModal = () => {
    setIsGradeModalOpen(true);
  };

  const openParamModal = (scope: { versionId?: number; gradeId?: number }) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
  };
  
  // ✅ FIX: Default parameters and grades to empty arrays to prevent crashes.
  const parameters = version.parameters ?? [];
  const grades = version.grades ?? [];

  const isDraft = version.status === "DRAFT";
  // ✅ FIX: Use the safe, defaulted arrays for calculations.
  const hasParameters = parameters.length > 0;
  const hasGrades = grades.length > 0;
  const isEmptyDraft = isDraft && !hasParameters && !hasGrades;

  return (
    <>
      <AddGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        versionId={version.id}
        onSuccess={onDataChange}
      />
      <AddParameterModal
        isOpen={isParamModalOpen}
        onClose={() => setIsParamModalOpen(false)}
        scope={paramModalScope}
        onSuccess={onDataChange}
      />

      <div className="space-y-6">
        <VersionHeader
          version={version}
          isDraft={isDraft}
          onAddGrade={() => openGradeModal()}
          onAddParameter={() => openParamModal({ versionId: version.id })}
        />

        {isEmptyDraft && (
          <EmptyState
            onAddGradeClick={() => openGradeModal()}
            onAddParameterClick={() =>
              openParamModal({ versionId: version.id })
            }
          />
        )}
        {hasParameters && (
          <ParameterSection
            isDraft={isDraft}
            versionId={version.id}
            parameters={parameters} // ✅ FIX: Pass the safe array
            onOpenParamModal={openParamModal}
          />
        )}
        {hasGrades && (
          <GradeSection
            isDraft={isDraft}
            versionId={version.id}
            grades={grades} // ✅ FIX: Pass the safe array
            onOpenGradeModal={openGradeModal}
            onOpenParamModal={openParamModal}
          />
        )}
      </div>
    </>
  );
}

// ====================================================================
// --- UI Sub-Components ---
// ====================================================================

const VersionHeader = ({
  version,
  isDraft,
  onAddGrade,
  onAddParameter,
}: any) => (
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Manage Version: {version.version_name}
      </h1>
      <div className="mt-2 flex items-center gap-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
            isDraft
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {isDraft ? <Unlock size={14} /> : <Lock size={14} />}
          {version.status}
        </span>
        {version.is_active && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <ShieldCheck size={14} /> Active
          </span>
        )}
      </div>
    </div>
    {isDraft && (
      <div className="flex gap-2">
        <button
          onClick={onAddGrade}
          className="inline-flex items-center gap-2 rounded-md bg-white text-slate-700 font-medium px-3 py-2 text-sm border border-slate-300 hover:bg-slate-50"
        >
          <Plus size={16} /> Add Grade
        </button>
        <button
          onClick={onAddParameter}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700"
        >
          <Plus size={16} /> Add Parameter
        </button>
      </div>
    )}
  </div>
);

const EmptyState = ({ onAddGradeClick, onAddParameterClick }: any) => (
  <div className="text-center bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-300">
    <h3 className="text-lg font-semibold text-slate-800">
      This Draft Version is Empty
    </h3>
    <p className="mt-1 text-sm text-slate-500">
      Choose how to structure this blueprint. You can add quality grades, or add
      testable parameters directly.
    </p>
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-md mx-auto">
      <button
        onClick={onAddGradeClick}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
      >
        <Layers className="w-8 h-8 text-indigo-600 mb-2" />
        <span className="font-semibold text-slate-700">Add Grades</span>
        <span className="text-xs text-slate-500">e.g., Grade A, Grade B</span>
      </button>
      <button
        onClick={onAddParameterClick}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm hover:border-green-500 hover:bg-green-50 transition-colors"
      >
        <FlaskConical className="w-8 h-8 text-green-600 mb-2" />
        <span className="font-semibold text-slate-700">Add Parameters</span>
        <span className="text-xs text-slate-500">e.g., Viscosity, pH</span>
      </button>
    </div>
  </div>
);

const ParameterSection = ({
  isDraft,
  versionId,
  parameters,
  onOpenParamModal,
}: any) => (
  <div className="p-6 bg-white rounded-xl border border-slate-200/70 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-semibold text-slate-800">Parameters</h4>
      {isDraft && (
        <button
          onClick={() => onOpenParamModal({ versionId: versionId })}
          className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-3 py-1.5 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          <Plus size={16} /> Add Parameter
        </button>
      )}
    </div>
    <ParameterTable parameters={parameters} />
  </div>
);

const GradeSection = ({
  isDraft,
  versionId,
  grades,
  onOpenGradeModal,
  onOpenParamModal,
}: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-900">Product Grades</h2>
      {isDraft && (
        <button
          onClick={() => onOpenGradeModal(versionId)}
          className="inline-flex items-center gap-2 rounded-md bg-white text-slate-700 font-medium px-3 py-2 text-sm border border-slate-300 hover:bg-slate-50"
        >
          <Plus size={16} /> Add Grade
        </button>
      )}
    </div>
    {grades.map((g: ProductGrade) => (
      <GradeCard
        key={g.id}
        grade={g}
        isDraft={isDraft}
        onAddParameter={() => onOpenParamModal({ gradeId: g.id })}
      />
    ))}
  </div>
);

const GradeCard = ({ grade, isDraft, onAddParameter }: any) => {
  // ✅ FIX: Default grade.parameters to an empty array.
  const parameters = grade.parameters ?? [];
  const hasParameters = parameters.length > 0;

  return (
    <div className="bg-white border border-slate-200/70 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200/70 flex justify-between items-center">
        <h4 className="font-semibold text-slate-800">{grade.name}</h4>
        {isDraft && (
          <button
            onClick={onAddParameter}
            className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-3 py-1.5 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          >
            <Plus size={16} /> Add Parameter
          </button>
        )}
      </div>
      <div className="p-4">
        {hasParameters ? (
          <ParameterTable parameters={parameters} /> // ✅ FIX: Pass the safe array
        ) : (
          <p className="text-center text-sm text-slate-500 py-4">
            No parameters defined for this grade.
          </p>
        )}
      </div>
    </div>
  );
};

const ParameterTable = ({
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
        {(parameters ?? []).map((param) => ( // ✅ FIX: Extra safety for mapping
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