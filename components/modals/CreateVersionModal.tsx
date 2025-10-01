"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createVersion } from "@/lib/api/version";
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
  version_name: z.string().min(1, { message: "Version name is required." }),
  description: z.string().optional(),
});

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | string;
  onSuccess: () => void;
}

export function CreateVersionModal({
  isOpen,
  onClose,
  productId,
  onSuccess,
}: CreateVersionModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  // ✅ 1. Add our own loading state to prevent double submission.
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { version_name: "", description: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // ✅ 2. Set loading to true immediately.
    setIsLoading(true);
    setApiError(null);
    try {
      await createVersion({ ...values, product: Number(productId) });
      onSuccess();
      onClose();
      form.reset();
    } catch (error: any) {
      if (error.response?.data?.non_field_errors) {
        setApiError(`Error: ${error.response.data.non_field_errors[0]}`);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Ensure loading is set to false even if there's an error.
      setIsLoading(false);
    }
  };

  const inputStyles =
    "block w-full rounded-md border-0 bg-white py-2.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-50 p-0 rounded-xl border border-slate-200/80">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200/80">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Create New Version
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            A new version will be created in DRAFT status.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="version_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Version Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., v1.0, 2025 Q4 Update"
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
                        placeholder="A brief summary of this version's purpose..."
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
              <Button
                type="button"
                onClick={onClose}
                className="bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                // ✅ 3. Disable the button using our state as well.
                disabled={isSubmitting || isLoading}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {(isSubmitting || isLoading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Version
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}