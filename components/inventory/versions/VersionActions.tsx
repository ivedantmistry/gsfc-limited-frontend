// src/components/inventory/versions/VersionActions.tsx

import React from "react";
import { Version } from "@/lib/types";
import { Lock, Copy, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // ✅ Import Button
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // ✅ Import Tooltip components

type VersionActionsProps = {
  version: Version;
  isLoading: boolean;
  onLock: (id: number) => void;
  onActivate: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  canManage?: boolean;
};

export const VersionActions: React.FC<VersionActionsProps> = ({
  version,
  isLoading,
  onLock,
  onActivate,
  onClone,
  onDelete,
  canManage,
}) => {
  if (!canManage) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex justify-end items-center gap-1">
        {version.status === "DRAFT" && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onLock(version.id)}
                  disabled={isLoading}
                >
                  <Lock size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lock Version</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(version.id)}
                  disabled={isLoading}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Draft</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
        {version.status === "LOCKED" && !version.is_active && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onActivate(version.id)}
                disabled={isLoading}
              >
                <CheckCircle size={16} className="text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Activate Version</p>
            </TooltipContent>
          </Tooltip>
        )}
        {version.status === "LOCKED" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onClone(version.id)}
                disabled={isLoading}
              >
                <Copy size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clone to New Draft</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
