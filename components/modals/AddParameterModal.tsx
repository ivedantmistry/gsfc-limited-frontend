"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createParameterForVersion,
  createParameterForGrade,
} from "@/lib/api/parameter";
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
    description: z.string().optional(),
    unit: z.string().optional(),
    is_required: z.boolean().default(true),
    data_type: z.enum(DATA_TYPE_CHOICES, { error: "Data type is required." }),
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
  scope: { versionId?: string | number; gradeId?: string | number };
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
      description: "",
      unit: "",
      is_required: true,
      data_type: "STRING",
      min_value: undefined,
      max_value: undefined,
      enum_options: "",
      boolean_true_label: "",
      boolean_false_label: "",
    },
  });

  const dataType = form.watch("data_type");
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ParameterFormData) => {
    setApiError(null);
    try {
      const apiValues = {
        ...values,
        description: values.description || null,
        unit: values.unit || null,
        min_value: values.min_value?.toString() ?? null,
        max_value: values.max_value?.toString() ?? null,
        enum_options: values.enum_options || undefined,
        boolean_true_label: values.boolean_true_label || null,
        boolean_false_label: values.boolean_false_label || null,
      };

      if (scope.versionId) {
        await createParameterForVersion(Number(scope.versionId), apiValues);
      } else if (scope.gradeId) {
        await createParameterForGrade(Number(scope.gradeId), apiValues);
      } else {
        throw new Error("Invalid scope: No versionId or gradeId provided.");
      }

      onSuccess();
      onClose();
      form.reset();
    } catch (error: any) {
      console.error(error);
      setApiError("An unexpected error occurred. Please try again.");
    }
  };

  const inputStyles =
    "block w-full rounded-md border-0 bg-white py-2.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150";
  const selectTriggerStyles = `${inputStyles} flex items-center justify-between`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-50 p-0 rounded-xl border border-slate-200/80">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200/80">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Define a New Parameter
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Specify the details and constraints for this quality parameter.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto pr-5">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
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
                    <FormLabel className="text-sm font-medium text-slate-700">
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
                            {type.charAt(0) + type.slice(1).toLowerCase()}
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
                    <FormLabel className="text-sm font-medium text-slate-700">
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
                        <FormLabel>Min Value</FormLabel>
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
                        <FormLabel>Max Value</FormLabel>
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
                      <FormLabel>Enum Options</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Pass, Fail, Retest"
                          className={inputStyles}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-slate-500 px-1">
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
                        <FormLabel>'True' Label</FormLabel>
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
                        <FormLabel>'False' Label</FormLabel>
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
              <p className="text-sm text-red-600 px-6 pb-4">{apiError}</p>
            )}
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
                Save Parameter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
