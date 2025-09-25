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
      onSuccess(); // Re-fetch the product data to show the new grade
      onClose(); // Close the modal
    } catch (error: any) {
      if (error.response?.data?.name) {
        setApiError(`Error: ${error.response.data.name[0]}`);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Grade</DialogTitle>
          <DialogDescription>
            Enter the details for the new product grade.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Name</FormLabel>
                  <FormControl>
                    {/* STYLE: Applied consistent Apple-like focus ring and border styles */}
                    <Input
                      placeholder="e.g., Grade A - Premium"
                      className="w-full rounded-md border-0 bg-gray-100/70 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    {/* STYLE: Applied consistent Apple-like focus ring and border styles */}
                    <Textarea
                      placeholder="Enter a brief description of this grade"
                      className="w-full rounded-md border-0 bg-gray-100/70 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {apiError && <p className="text-sm text-red-500">{apiError}</p>}
            <div className="flex justify-end pt-2">
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
