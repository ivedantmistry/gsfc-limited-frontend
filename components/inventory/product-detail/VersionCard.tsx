// /components/inventory/product-detail/VersionCard.tsx
import {
  VersionNested as Version,
  ParameterDefinition,
} from "@/lib/types";
import { FileCheck2, Lock, Unlock, Copy } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { ParameterSection } from "./ParameterSection";
import { GradeSection } from "./GradeSection";

interface VersionCardProps {
  version: Version;
  onLock: (versionId: number) => void;
  onActivate: (versionId: number) => void;
  onClone: (versionId: number) => void;
  onOpenGradeModal: (versionId: number) => void;
  onOpenParamModal: (
    scope: { versionId?: number; gradeId?: number },
    paramToEdit?: ParameterDefinition | null
  ) => void;
}

export const VersionCard = ({
  version,
  onLock,
  onActivate,
  onClone,
  onOpenGradeModal,
  onOpenParamModal,
}: VersionCardProps) => {
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