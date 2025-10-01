"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Product,
  VersionNested as Version,
  ParameterDefinition,
  ProductGrade as Grade,
} from "@/lib/types";
import {
  activateVersion,
  createNewVersionFromExisting,
  createVersion,
  lockVersion,
} from "@/lib/api/version";
import {
  createParameterForVersion,
  createParameterForGrade,
} from "@/lib/api/parameter";
import { createGrade } from "@/lib/api/grade";
import {
  ChevronRight,
  Plus,
  FileCheck2,
  Lock,
  Unlock,
  Copy,
  AlertTriangle,
  Layers,
  FlaskConical,
} from "lucide-react";

import { CreateVersionModal } from "@/components/modals/CreateVersionModal";
import AddGradeModal from "@/components/modals/AddGradeModal";
import AddParameterModal from "@/components/modals/AddParameterModal";

// ====================================================================
// --- Main View Component ---
// ====================================================================

interface ProductDetailViewProps {
  product: Product;
  onDataChange: () => void; // This is the 'mutate' function from the parent
}

export function ProductDetailView({
  product,
  onDataChange,
}: ProductDetailViewProps) {
  // --- State Management for Modals ---
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [targetVersionId, setTargetVersionId] = useState<number | null>(null);
  const [paramModalScope, setParamModalScope] = useState<{
    versionId?: number;
    gradeId?: number;
  }>({});

  // --- Handler Functions for API Calls ---
  const handleCreateVersion = async (versionName: string) => {
    await createVersion({ product: product.id, version_name: versionName });
    onDataChange();
    setIsVersionModalOpen(false);
  };
  const handleLock = async (versionId: number) => {
    if (!window.confirm("Locking a version is permanent. Are you sure?"))
      return;
    await lockVersion(versionId);
    onDataChange();
  };
  const handleActivate = async (versionId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to set this as the active version?"
      )
    )
      return;
    await activateVersion(versionId);
    onDataChange();
  };
  const handleClone = async (versionId: number) => {
    await createNewVersionFromExisting(versionId);
    onDataChange();
  };

  // --- Handler Functions for Opening Modals ---
  const openGradeModal = (versionId: number) => {
    setTargetVersionId(versionId);
    setIsGradeModalOpen(true);
  };
  const openParamModal = (scope: { versionId?: number; gradeId?: number }) => {
    setParamModalScope(scope);
    setIsParamModalOpen(true);
  };

  return (
    <>
      {/* --- Modals --- */}
      <CreateVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        productId={product.id}
        onSuccess={handleCreateVersion}
      />
      <AddGradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        versionId={targetVersionId}
        onSuccess={onDataChange}
      />
      <AddParameterModal
        isOpen={isParamModalOpen}
        onClose={() => setIsParamModalOpen(false)}
        scope={paramModalScope}
        onSuccess={onDataChange}
      />

      {/* --- Main UI --- */}
      <div className="space-y-8">
        <ProductHeader product={product} />
        <VersionSection
          versions={product.versions}
          onOpenCreateVersionModal={() => setIsVersionModalOpen(true)}
          onLock={handleLock}
          onActivate={handleActivate}
          onClone={handleClone}
          onOpenGradeModal={openGradeModal}
          onOpenParamModal={openParamModal}
        />
      </div>
    </>
  );
}

// ====================================================================
// --- UI Sub-Components (Co-located for simplicity) ---
// ====================================================================

const ProductHeader = ({ product }: { product: Product }) => (
  <div>
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            href="/dashboard/products"
            className="text-sm font-medium text-slate-700 hover:text-indigo-600"
          >
            Products
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2">
              {product.name}
            </span>
          </div>
        </li>
      </ol>
    </nav>
    <div className="mt-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {product.name}
      </h1>
      {product.description && (
        <p className="mt-1 text-lg text-slate-600">{product.description}</p>
      )}
    </div>
  </div>
);

const VersionSection = ({
  versions,
  onOpenCreateVersionModal,
  onLock,
  onActivate,
  onClone,
  onOpenGradeModal,
  onOpenParamModal,
}: any) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Versions</h2>
        <button
          onClick={onOpenCreateVersionModal}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700"
        >
          <Plus size={16} /> Create New Version
        </button>
      </div>
      {versions.length > 0 ? (
        <div className="space-y-4">
          {versions.map((version: Version) => (
            <VersionCard
              key={version.id}
              version={version}
              onLock={onLock}
              onActivate={onActivate}
              onClone={onClone}
              onOpenGradeModal={onOpenGradeModal}
              onOpenParamModal={onOpenParamModal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white/80 rounded-xl border border-slate-200/70">
          <AlertTriangle className="mx-auto w-12 h-12 text-slate-400" />
          <p className="mt-4 font-semibold text-slate-700">No Versions Found</p>
          <p className="text-sm text-slate-500">
            Create the first version to define this product's testing blueprint.
          </p>
        </div>
      )}
    </div>
  );
};

const VersionCard = ({
  version,
  onLock,
  onActivate,
  onClone,
  onOpenGradeModal,
  onOpenParamModal,
}: any) => {
  const isDraft = version.status === "DRAFT";
  const hasParameters = version.parameters.length > 0;
  const hasGrades = version.grades.length > 0;
  const isEmptyDraft = isDraft && !hasParameters && !hasGrades;

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm">
      <div
        className={`p-4 flex justify-between items-center ${
          version.is_active ? "bg-indigo-50 rounded-t-xl" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <FileCheck2
            className={`w-6 h-6 ${
              version.is_active ? "text-indigo-600" : "text-slate-500"
            }`}
          />
          <div>
            <p className="font-bold text-slate-800">{version.version_name}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {isDraft ? <Unlock size={12} /> : <Lock size={12} />}
              <span>{version.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDraft && (
            <button
              onClick={() => onLock(version.id)}
              className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-200 rounded-full hover:bg-amber-300"
            >
              Lock Version
            </button>
          )}
          {version.status === "LOCKED" && !version.is_active && (
            <button
              onClick={() => onActivate(version.id)}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300"
            >
              Set as Active
            </button>
          )}
          {version.status === "LOCKED" && (
            <button
              onClick={() => onClone(version.id)}
              className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200"
            >
              <Copy size={12} className="inline mr-1" /> Clone
            </button>
          )}
          {version.is_active && (
            <span className="px-3 py-1 text-xs font-bold text-white bg-indigo-500 rounded-full">
              ACTIVE
            </span>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200/70 p-4 space-y-4">
        {isEmptyDraft && (
          <EmptyState
            onAddGradeClick={() => onOpenGradeModal(version.id)}
            onAddParameterClick={() =>
              onOpenParamModal({ versionId: version.id })
            }
          />
        )}
        {hasParameters && (
          <ParameterSection
            isDraft={isDraft}
            versionId={version.id}
            parameters={version.parameters}
            onOpenParamModal={onOpenParamModal}
          />
        )}
        {hasGrades && (
          <GradeSection
            isDraft={isDraft}
            versionId={version.id}
            grades={version.grades}
            onOpenGradeModal={onOpenGradeModal}
            onOpenParamModal={onOpenParamModal}
          />
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onAddGradeClick, onAddParameterClick }: any) => (
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

const ParameterSection = ({
  isDraft,
  versionId,
  parameters,
  onOpenParamModal,
}: any) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold text-slate-700">Parameters</h4>
      {isDraft && (
        <button
          onClick={() => onOpenParamModal({ versionId: versionId })}
          className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-2 py-1 text-xs ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
        >
          <Plus size={14} /> Add Parameter
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
  <div>
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-semibold text-slate-700">Product Grades</h4>
      {isDraft && (
        <button
          onClick={() => onOpenGradeModal(versionId)}
          className="inline-flex items-center gap-1.5 rounded-md bg-white text-slate-700 font-medium px-2 py-1 text-xs ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
        >
          <Plus size={14} /> Add Grade
        </button>
      )}
    </div>
    <div className="space-y-3">
      {grades.map((g: Grade) => (
        <GradeCard
          key={g.id}
          grade={g}
          isDraft={isDraft}
          onAddParameter={() => onOpenParamModal({ gradeId: g.id })}
        />
      ))}
    </div>
  </div>
);

const GradeCard = ({ grade, isDraft, onAddParameter }: any) => {
  const hasParameters = grade.parameters.length > 0;
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-5 h-5 text-indigo-600" />
          <div>
            <h4 className="font-semibold text-slate-800">{grade.name}</h4>
            {grade.description && (
              <p className="text-sm text-slate-500">{grade.description}</p>
            )}
          </div>
        </div>
        {isDraft && (
          <button
            onClick={onAddParameter}
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            Add Parameter
          </button>
        )}
      </div>
      {hasParameters && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <ParameterTable parameters={grade.parameters} />
        </div>
      )}
    </div>
  );
};

const ParameterTable = ({
  parameters,
}: {
  parameters: ParameterDefinition[];
}) => (
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
            <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">
              {param.max_value || "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
