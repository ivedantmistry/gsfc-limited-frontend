"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { Product } from "@/lib/types/products";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

// Define the form validation schema using Zod
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().optional(),
});

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
}: AddProductModalProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setApiError(null);
    try {
      const response = await api.post<Product>("/inventory/products/", values);
      const newProduct = response.data;
      onClose();
      router.push(`/dashboard/products/${newProduct.id}`);
    } catch (error: any) {
      if (error.response?.data?.name) {
        setApiError(`Error: ${error.response.data.name[0]}`);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // REVAMPED: Centralized input styles to match our new theme
  const inputStyles =
    "block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* REVAMPED: Using a crisp white background for the modal */}
      <DialogContent className="sm:max-w-lg bg-white">
        {/* REVAMPED: Header typography updated */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Create a New Product
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Provide a name and an optional description for your new product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Product Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Anhydrous Ammonia"
                        {...field}
                        className={inputStyles}
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
                        placeholder="A brief summary of what this product is..."
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

            {apiError && <p className="text-sm text-red-600">{apiError}</p>}
            
            {/* REVAMPED: Footer with better contrast and themed buttons */}
            <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6 mt-6 rounded-b-xl sm:justify-end">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-800 text-white hover:bg-slate-700"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}