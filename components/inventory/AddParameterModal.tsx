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

  const inputStyles =
    "block w-full rounded-md border-0 bg-gray-100 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0071e3] sm:text-sm transition-shadow duration-150";

      const selectTriggerStyles = `${inputStyles} flex items-center justify-between`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-50">
        <DialogHeader className="px-1 pt-1">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Define a New Parameter
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Specify the details and constraints for this quality parameter.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-2"
          >
            <div className="space-y-4 px-1 max-h-[60vh] overflow-y-auto pr-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Parameter Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Viscosity"
                        className={inputStyles}
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Data Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={selectTriggerStyles}>
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
              <FormField
                name="unit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Unit (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., cP, %, ppm"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(dataType === "DECIMAL" || dataType === "INTEGER") && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="min_value"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Min Value
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className={inputStyles}
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Max Value
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className={inputStyles}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {dataType === "ENUM" && (
                <FormField
                  name="enum_options"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Enum Options
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Pass, Fail, Retest"
                          className={inputStyles}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 px-1">
                        Enter options separated by a comma.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {dataType === "BOOLEAN" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="boolean_true_label"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          'True' Label
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Present"
                            className={inputStyles}
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          'False' Label
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Absent"
                            className={inputStyles}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
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
                Save Parameter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
