// src/components/modals/EditGradeModal.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProductGrade } from "@/lib/types";
import { updateGrade } from "@/lib/api/grade";
import { toast } from "sonner";
import { mutate } from "swr";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: ProductGrade | null;
  versionId: number;
}

type FormData = {
  name: string;
  description: string;
};

export default function EditGradeModal({
  isOpen,
  onClose,
  grade,
  versionId,
}: EditGradeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (grade) {
      reset({
        name: grade.name,
        description: grade.description || "",
      });
    }
  }, [grade, reset]);

  const onSubmit = async (data: FormData) => {
    if (!grade) return;
    try {
      await updateGrade(grade.id, data);
      toast.success("Grade updated successfully.");
      mutate(`/inventory/versions/${versionId}/`);
      onClose();
    } catch {
      toast.error("Failed to update grade. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product Grade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Grade Name</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
