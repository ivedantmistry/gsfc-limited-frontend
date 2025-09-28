"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProductGrade } from "@/lib/api/product";

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
  productId: string | number;
  onSuccess: () => void;
}

export default function AddGradeModal({
  isOpen,
  onClose,
  productId,
  onSuccess,
}: AddGradeModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setApiError(null);
    try {
      await createProductGrade(productId, values);
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

  // REVAMPED: Consistent input styles from our new theme
  const inputStyles =
    "block w-full rounded-md border-0 bg-white py-2.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* REVAMPED: Modal content uses the new theme's structure and styling */}
      <DialogContent className="sm:max-w-lg bg-slate-50 p-0 rounded-xl border border-slate-200/80">
        {/* NEW: Tighter header spacing by controlling padding here */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-200/80">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Create a New Grade
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Define a new quality tier for this product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* NEW: Consistent padding for the form body */}
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
                        placeholder="A brief summary of this grade's characteristics."
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

            {/* REVAMPED: macOS-style footer with a distinct background and themed buttons */}
            <div className="flex justify-end gap-3 p-4 bg-slate-200/60 border-t border-slate-200/80">
              <Button
                type="button"
                onClick={onClose}
                className="bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
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
