"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createGrade } from "@/lib/api/grade";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Grade name is required." }),
  description: z.string().optional(),
});

interface AddGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionId: number | null; // Can be null when modal is closed
  onSuccess: () => void;
}

export default function AddGradeModal({
  isOpen,
  onClose,
  versionId,
  onSuccess,
}: AddGradeModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  // Reset form when the modal opens for a new entry
  useEffect(() => {
    if (isOpen) {
      form.reset();
      setApiError(null);
    }
  }, [isOpen, form]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!versionId) {
      setApiError("Error: No version selected to add the grade to.");
      return;
    }
    setApiError(null);
    try {
      await createGrade(versionId, values);
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.response?.data?.name) {
        setApiError(`Error: ${error.response.data.name[0]}`);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const inputStyles =
    "block w-full rounded-md border-0 bg-white py-2.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-50 p-0 rounded-xl border border-slate-200/80">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200/80">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Add New Grade
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Define a new quality tier for this product version.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Grade Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Grade A - Premium"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief summary of this grade's characteristics..."
                        className={`${inputStyles} resize-none`}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {apiError && (
                <p className="text-sm text-red-600 pt-2">{apiError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 p-4 bg-slate-200/60 border-t border-slate-200/80">
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Grade
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}