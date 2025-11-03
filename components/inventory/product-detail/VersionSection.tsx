// /components/inventory/product-detail/VersionSection.tsx
import {
  VersionNested as Version,
  ParameterDefinition,
} from "@/lib/types";
import { AlertTriangle, Plus } from "lucide-react";
import { VersionCard } from "./VersionCard";

interface VersionSectionProps {
  versions: Version[];
  onOpenCreateVersionModal: () => void;
  onLock: (versionId: number) => void;
  onActivate: (versionId: number) => void;
  onClone: (versionId: number) => void;
  onOpenGradeModal: (versionId: number) => void;
  onOpenParamModal: (
    scope: { versionId?: number; gradeId?: number },
    paramToEdit?: ParameterDefinition | null
  ) => void;
}

export const VersionSection = ({
  versions,
  onOpenCreateVersionModal,
  onLock,
  onActivate,
  onClone,
  onOpenGradeModal,
  onOpenParamModal,
}: VersionSectionProps) => {
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
            Create the first version to define this product&apos;s testing blueprint.
          </p>
        </div>
      )}
    </div>
  );
};