import React from "react";
import { Version } from "@/lib/types";
import { Lock, Copy, Trash2, CheckCircle } from "lucide-react";

type VersionActionsProps = {
  version: Version;
  isLoading: boolean; // ✅ ADD THIS PROP
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
};

const iconButtonClass =
  "p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"; // Add disabled styles

export const VersionActions: React.FC<VersionActionsProps> = ({
  version,
  isLoading, // ✅ GET THE PROP
  onLock,
  onActivate,
  onClone,
  onDelete,
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      {version.status === "DRAFT" && (
        <>
          <button
            onClick={() => onLock(version.id)}
            title="Lock Version"
            disabled={isLoading} // ✅ DISABLE BUTTON
            className={`${iconButtonClass} text-amber-600 hover:bg-amber-100`}
          >
            <Lock size={18} />
          </button>
          <button
            onClick={() => onDelete(version.id)}
            title="Delete Draft"
            disabled={isLoading} // ✅ DISABLE BUTTON
            className={`${iconButtonClass} text-red-600 hover:bg-red-100`}
          >
            <Trash2 size={18} />
          </button>
        </>
      )}
      {version.status === "LOCKED" && !version.is_active && (
        <button
          onClick={() => onActivate(version.id)}
          title="Activate Version"
          disabled={isLoading} // ✅ DISABLE BUTTON
          className={`${iconButtonClass} text-green-600 hover:bg-green-100`}
        >
          <CheckCircle size={18} />
        </button>
      )}
      {version.status === "LOCKED" && (
        <button
          onClick={() => onClone(version.id)}
          title="Clone Version"
          disabled={isLoading} // ✅ DISABLE BUTTON
          className={`${iconButtonClass} text-indigo-600 hover:bg-indigo-100`}
        >
          <Copy size={18} />
        </button>
      )}
    </div>
  );
};