// src/components/modals/create-test-wizard/Step2_DetailsAndResults/index.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, ParameterDefinition } from "@/lib/types/product.types";
import { TestRecordInput, TestResultInput } from "@/lib/types/test.types";
import { useActiveVersionForProduct } from "@/lib/api/version";
import { useLabs } from "@/lib/api/lab";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SampleDetailsForm from "./SampleDetailsForm";
import ParameterInputs from "./ParameterInputs";

interface Step2Props {
  product: Product;
  onBack: () => void;
  onSubmit: (data: TestRecordInput) => void;
  isSubmitting: boolean;
  apiError: string | null;
}

// ✅ FIX: ENSURE THIS HELPER FUNCTION IS IN THIS FILE
const buildSchema = (parameters: ParameterDefinition[]) => {
  const parameterSchema = z.object(
    Object.fromEntries(
      parameters.map((param) => {
        let validator: z.ZodTypeAny = z.any();
        switch (param.data_type) {
          case "INTEGER":
          case "DECIMAL":
            validator = z.coerce.number();
            break;
          case "STRING":
          case "ENUM":
            validator = z.string();
            break;
          case "BOOLEAN":
            validator = z.boolean().default(false);
            break;
        }
        if (param.is_required) {
          validator = validator.refine(
            (val) => val !== "" && val !== undefined && val !== null,
            { message: "This field is required." }
          );
        } else {
          validator = validator.optional();
        }
        return [param.id, validator];
      })
    )
  );

  return z.object({
    lab: z.string().min(1, "Lab is required."),
    sample_id: z.string().min(1, "Sample ID is required."),
    batch_no: z.string().min(1, "Batch Number is required."),
    product_grade: z.string().optional(),
    parameters: parameterSchema,
  });
};

export default function Step2_DetailsAndResults({
  product,
  onBack,
  onSubmit,
  isSubmitting,
  apiError,
}: Step2Props) {
  const {
    activeVersion,
    isLoading: isLoadingVersion,
    error: versionError,
  } = useActiveVersionForProduct(product.id);
  const { labs, isLoading: isLoadingLabs } = useLabs();
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);

  const parametersToRender = selectedGradeId
    ? activeVersion?.grades.find((g) => g.id === Number(selectedGradeId))
        ?.parameters || []
    : activeVersion?.parameters || [];

  const formSchema = buildSchema(parametersToRender);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // This line will now work
    defaultValues: { sample_id: "", batch_no: "", parameters: {} },
  });

  // ✅ 2. ADD THIS useEffect HOOK
  // This hook watches for changes in the list of parameters.
  // When you select a grade, `parametersToRender` changes, and this effect runs.
  // `form.reset()` tells React Hook Form to update its internal state and apply
  // the new validation schema, which makes the new parameter fields work correctly.
  useEffect(() => {
    // We get the current values of the static fields so we don't erase them.
    const currentStaticValues = {
      lab: form.getValues("lab"),
      sample_id: form.getValues("sample_id"),
      batch_no: form.getValues("batch_no"),
      product_grade: form.getValues("product_grade"),
    };

    // Reset the form, keeping existing data and re-evaluating the new schema.
    form.reset({
      ...currentStaticValues,
      parameters: {}, // Clear out old parameter values
    });
  }, [parametersToRender, form.reset]);

  // ✅ AND ENSURE THIS HELPER FUNCTION IS HERE TOO
  const handleSubmit = (values: FormValues) => {
    const results_input: TestResultInput[] = Object.entries(values.parameters)
      .map(([paramId, value]) => ({
        parameter: Number(paramId),
        value: value as any,
      }))
      .filter(
        (r) => r.value !== undefined && r.value !== null && r.value !== ""
      );

    const finalData: TestRecordInput = {
      version: activeVersion!.id,
      lab: Number(values.lab),
      product_grade: selectedGradeId ? Number(selectedGradeId) : null,
      sample_id: values.sample_id,
      batch_no: values.batch_no,
      results_input: results_input,
    };
    onSubmit(finalData);
  };

  const isLoading = isLoadingVersion || isLoadingLabs;

  if (isLoading) {
    return (
      <div className="p-12 text-center flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading
        specification...
      </div>
    );
  }
  if (versionError || !activeVersion) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load specification for this product.
      </div>
    );
  }

  return (
    <>
      <DialogHeader className="p-6 pb-4 border-b">
        <DialogTitle className="text-lg font-semibold">
          Step 2: Enter Details & Results
        </DialogTitle>
        <DialogDescription>
          Using specification{" "}
          <span className="font-semibold">{activeVersion.version_name}</span>{" "}
          for product <span className="font-semibold">{product.name}</span>.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <SampleDetailsForm control={form.control} labs={labs} />

            {activeVersion.grades && activeVersion.grades.length > 0 && (
              <FormField
                control={form.control}
                name="product_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Grade</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedGradeId(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade to see its parameters" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeVersion.grades.map((grade) => (
                          <SelectItem key={grade.id} value={String(grade.id)}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <hr />

            <ParameterInputs
              control={form.control}
              parameters={parametersToRender}
              message={
                activeVersion.grades.length > 0 && !selectedGradeId
                  ? "Please select a grade to see its parameters."
                  : "No parameters defined for this selection."
              }
            />
          </div>

          {apiError && (
            <div className="px-6 pb-4">
              <Alert variant="destructive">
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex justify-between items-center p-4 bg-slate-100 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting || !labs}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Test Record
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
