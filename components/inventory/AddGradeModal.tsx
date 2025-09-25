"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProductGrade } from "@/lib/api/products";

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

  const inputStyles =
    "block w-full rounded-md border-0 bg-gray-100 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0071e3] sm:text-sm transition-shadow duration-150";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-50">
        <DialogHeader className="px-1 pt-1">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Create a New Grade
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Define a new quality tier for this product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-2"
          >
            <div className="space-y-4 px-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
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
                    <FormLabel className="text-sm font-medium text-gray-700">
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
            </div>

            {apiError && (
              <p className="text-sm text-red-600 px-1">{apiError}</p>
            )}

            <div className="flex justify-end items-center gap-4 bg-gray-100 p-4 -m-6 mt-6 rounded-b-lg">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 text-white hover:bg-gray-800"
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
