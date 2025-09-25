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
      // The backend ProductViewSet handles the POST request to create a new product
      const response = await api.post<Product>("/inventory/products/", values);
      const newProduct = response.data;

      // Close the modal
      onClose();

      // Redirect to the new product's detail page
      router.push(`/dashboard/products/${newProduct.id}`);
    } catch (error: any) {
      // Handle potential API errors (e.g., duplicate name)
      if (error.response && error.response.data && error.response.data.name) {
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
      {/* Increased max-width for better spacing */}
      <DialogContent className="sm:max-w-lg bg-gray-50">
        <DialogHeader className="px-1 pt-1">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Create a New Product
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Provide a name and an optional description for your new product.
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief summary of what this product is and its primary use cases."
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

            {/* Revamped footer with better spacing and button styles */}
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
                Save Product
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
