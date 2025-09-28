"use client";

import React, { useState, useEffect } from "react";
import { ParameterDefinition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateSpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  parametersToLock: ParameterDefinition[];
  nextVersionNumber: number;
}

export const CreateSpecificationModal: React.FC<CreateSpecificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parametersToLock,
  nextVersionNumber,
}) => {
  const [name, setName] = useState("");

  // Reset the name when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setName(`v${nextVersionNumber}.0 - `);
    }
  }, [isOpen, nextVersionNumber]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-50 p-0 rounded-xl border border-slate-200/80">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Create Specification v{nextVersionNumber}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            You are about to lock the following parameters into a new, unchangeable
            specification. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spec-name">Descriptive Name</Label>
            <Input
              id="spec-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., v1.0 - Initial Release"
            />
          </div>
          <div className="space-y-2">
            <Label>Parameters to be Locked</Label>
            <div className="max-h-48 overflow-y-auto rounded-md border bg-white p-3 text-sm text-slate-600 space-y-1">
              {parametersToLock.map((p) => (
                <p key={p.id}>&bull; {p.name}</p>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end gap-3 p-4 bg-slate-200/60 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Confirm & Lock Specification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};