"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types/product.types";
import { TestRecordInput } from "@/lib/types/test.types";
import { useActiveVersionForProduct } from "@/lib/api/version";
import { useLabs } from "@/lib/api/lab";
import { useCreateTestForm } from "@/hooks/useCreateTestForm"; // Import the hook

// UI Components
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
import { AlertTriangle, FileText, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SampleDetailsForm from "./SampleDetailsForm";
import ParameterInputs from "./ParameterInputs";

const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-3">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

interface Step2Props {
  product: Product;
  onBack: () => void;
  // ✅ FIX: onSubmit prop now correctly expects a Promise
  onSubmit: (data: TestRecordInput) => Promise<void>;
  isSubmitting: boolean;
  apiError: string | null;
}

// ✅ FIX: Removed the duplicate buildSchema, handleSubmit, and handleFormSubmit functions.
// All this logic is now inside the useCreateTestForm hook.

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

  const { form, parametersToRender, handleFormSubmit } = useCreateTestForm(
    activeVersion,
    selectedGradeId
  );

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
        Failed to load data entry for this product.
      </div>
    );
  }

  return (
    <>
      <DialogHeader className="p-6 pb-4 border-b bg-white">
        <DialogTitle className="text-xl font-bold text-slate-800 flex items-center">
          <FileText className="mr-3 h-6 w-6 text-indigo-600" />
          Step 2: Enter Details & Results
        </DialogTitle>
        <DialogDescription>
          Using specification{" "}
          <span className="font-semibold">{activeVersion.version_name}</span>{" "}
          for product <span className="font-semibold">{product.name}</span>.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            handleFormSubmit(values, onSubmit)
          )}
          className="flex flex-col"
        >
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <FormSection title="Sample Details">
              <SampleDetailsForm control={form.control} labs={labs} />
            </FormSection>

            {activeVersion.grades && activeVersion.grades.length > 0 && (
              <FormSection title="Product Grade">
                <FormField
                  control={form.control}
                  name="product_grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Grade</FormLabel>
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
              </FormSection>
            )}

            <FormSection title="Parameters">
              <ParameterInputs
                control={form.control}
                parameters={parametersToRender}
                message={
                  activeVersion.grades.length > 0 && !selectedGradeId
                    ? "Please select a grade to view its parameters."
                    : "No parameters defined for this selection."
                }
              />
            </FormSection>
          </div>

          {apiError && (
            <div className="px-6 pb-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex justify-between items-center p-4 bg-slate-100 border-t mt-auto">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !labs}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
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
