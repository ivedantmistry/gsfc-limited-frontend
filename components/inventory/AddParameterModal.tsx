"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createParameter } from "@/lib/api/products";
import { ParameterDefinition } from "@/lib/types/";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const DATA_TYPE_CHOICES = [
  "DECIMAL",
  "INTEGER",
  "STRING",
  "BOOLEAN",
  "ENUM",
] as const;

const formSchema = z
  .object({
    name: z.string().min(1, "Parameter name is required."),
    unit: z.string().optional(),
    data_type: z.enum(DATA_TYPE_CHOICES, {
      error: "Data type is required.",
    }),
    min_value: z.coerce.number().optional(),
    max_value: z.coerce.number().optional(),
    enum_options: z.string().optional(),
    boolean_true_label: z.string().optional(),
    boolean_false_label: z.string().optional(),
  })
  .refine((data) => data.data_type !== "ENUM" || !!data.enum_options, {
    message: "Options are required for ENUM type.",
    path: ["enum_options"],
  })
  .refine(
    (data) =>
      data.data_type !== "BOOLEAN" ||
      (!!data.boolean_true_label && !!data.boolean_false_label),
    {
      message: "Both 'True' and 'False' labels are required for BOOLEAN type.",
      path: ["boolean_true_label"],
    }
  );

type ParameterFormData = z.infer<typeof formSchema>;

interface AddParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  scope: { productId?: string | number; gradeId?: string | number };
  onSuccess: () => void;
}

export default function AddParameterModal({
  isOpen,
  onClose,
  scope,
  onSuccess,
}: AddParameterModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ParameterFormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      unit: "",
      data_type: "STRING",
      min_value: undefined,
      max_value: undefined,
      enum_options: "",
      boolean_true_label: "",
      boolean_false_label: "",
    } satisfies ParameterFormData,
  });

  const dataType = form.watch("data_type");
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ParameterFormData) => {
    setApiError(null);
    try {
      // Convert undefined optional fields to null for the API
      const apiValues = {
        ...values,
        unit: values.unit || null,
        min_value: values.min_value?.toString() ?? null,
        max_value: values.max_value?.toString() ?? null,
        enum_options: values.enum_options || undefined, // API expects string or undefined
        boolean_true_label: values.boolean_true_label || null,
        boolean_false_label: values.boolean_false_label || null,
      };
      await createParameter(apiValues, scope);
      onSuccess();
      onClose();
      form.reset();
    } catch (error: any) {
      setApiError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Parameter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {/* --- Always Visible Fields --- */}

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parameter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Viscosity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="unit"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., cP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="data_type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DATA_TYPE_CHOICES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Conditional Fields --- */}
            {/* Min/Max for Numeric Types */}
            {(dataType === "DECIMAL" || dataType === "INTEGER") && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="min_value"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="max_value"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Options for ENUM Type */}
            {dataType === "ENUM" && (
              <FormField
                name="enum_options"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enum Options</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Pass, Fail, Retest"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Enter options separated by a comma.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Labels for BOOLEAN Type */}
            {dataType === "BOOLEAN" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="boolean_true_label"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>'True' Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Present" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="boolean_false_label"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>'False' Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Absent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {apiError && <p className="text-sm text-red-500">{apiError}</p>}
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Parameter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
