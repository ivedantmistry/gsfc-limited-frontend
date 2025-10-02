"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, ParameterDefinition, ProductGrade } from "@/lib/types/product.types";
import { TestRecordInput, TestResultInput } from "@/lib/types/test.types";
import { useActiveVersionForProduct } from "@/lib/api/version";
// Placeholder for fetching labs. You would need to create this.
import { useLabs } from "@/lib/api/lab"; 
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step2_DetailsAndResultsProps {
  product: Product;
  onBack: () => void;
  onSubmit: (data: TestRecordInput) => void;
  isSubmitting: boolean;
  apiError: string | null;
}

// FIX: The schema is now built with a nested 'parameters' object
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
            validator = z.boolean().default(false); // Provide a default for switches
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
        // Use the parameter ID as the key within the nested object
        return [param.id, validator];
      })
    )
  );
  
  return z.object({
    lab: z.string().min(1, "Lab is required."),
    sample_id: z.string().min(1, "Sample ID is required."),
    batch_no: z.string().min(1, "Batch Number is required."),
    product_grade: z.string().optional(),
    parameters: parameterSchema, // All dynamic fields are now nested here
  });
};


export default function Step2_DetailsAndResults({
  product,
  onBack,
  onSubmit,
  isSubmitting,
  apiError,
}: Step2_DetailsAndResultsProps) {
  const { activeVersion, isLoading, error } = useActiveVersionForProduct(product.id);
  const { labs, isLoading: isLoadingLabs } = useLabs(); 
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);

  const parametersToRender = selectedGradeId
    ? activeVersion?.grades.find(g => g.id === Number(selectedGradeId))?.parameters || []
    : activeVersion?.parameters || [];

  const formSchema = buildSchema(parametersToRender);
  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sample_id: "",
      batch_no: "",
      parameters: {}, // Initialize the nested object
    },
  });

  // FIX: The submit handler now reads from the nested `values.parameters` object
  const handleSubmit = (values: FormValues) => {
    const results_input: TestResultInput[] = Object.entries(values.parameters)
      .map(([paramId, value]) => ({
        parameter: Number(paramId),
        value: value as any,
      }))
      .filter(r => r.value !== undefined && r.value !== null && r.value !== '');

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

  const renderParameterInput = (param: ParameterDefinition) => {
    // FIX: The field name is now a nested path, which TypeScript understands
    const fieldName = `parameters.${param.id}` as const; 

    switch (param.data_type) {
      case "INTEGER":
      case "DECIMAL":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{param.name} {param.unit && `(${param.unit})`}</FormLabel>
                <FormControl><Input type="number" step="any" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "ENUM":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{param.name}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {param.enum_options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "BOOLEAN":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white">
                <div className="space-y-0.5">
                  <FormLabel>{param.name}</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        );
      case "STRING":
      default:
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{param.name}</FormLabel>
                <FormControl><Input type="text" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading specification...</div>;
  }
  if (error || !activeVersion) {
    return <div className="p-6 text-center text-red-600">Failed to load specification for this product.</div>;
  }
  
  return (
    <>
      <DialogHeader className="p-6 pb-4 border-b">
        <DialogTitle className="text-lg font-semibold">Step 2: Enter Details & Results</DialogTitle>
        <DialogDescription>
          Using specification <span className="font-semibold">{activeVersion.version_name}</span> for product <span className="font-semibold">{product.name}</span>.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Sample Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <FormField control={form.control} name="lab" render={({ field }) => (
                     <FormItem>
                    <FormLabel>Lab</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a lab" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {/* ✅ 4. USE REAL LAB DATA */}
                        {labs?.map(lab => <SelectItem key={lab.id} value={String(lab.id)}>{lab.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField control={form.control} name="batch_no" render={({ field }) => ( <FormItem><FormLabel>Batch Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="sample_id" render={({ field }) => ( <FormItem><FormLabel>Sample ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>

            {/* Grade Selector (if applicable) */}
            {activeVersion.grades && activeVersion.grades.length > 0 && (
                <FormField control={form.control} name="product_grade" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Grade</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); setSelectedGradeId(value); }} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {activeVersion.grades.map(grade => <SelectItem key={grade.id} value={String(grade.id)}>{grade.name}</SelectItem>)}
                      </SelectContent> {/* FIX: Corrected the closing tag here */}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
            )}
            
            <hr />

            {/* Dynamic Parameter Fields */}
            <div className="space-y-4">
                {parametersToRender.length > 0 ? (
                    parametersToRender.map(param => (
                        <div key={param.id}>{renderParameterInput(param)}</div>
                    ))
                ) : (
                    <p className="text-sm text-center text-slate-500 py-4">
                        {activeVersion.grades.length > 0 && !selectedGradeId ? "Please select a grade to see its parameters." : "No parameters defined for this selection."}
                    </p>
                )}
            </div>
          </div>

            {apiError && <div className="px-6 pb-4"><Alert variant="destructive"><AlertDescription>{apiError}</AlertDescription></Alert></div>}

          <div className="flex justify-between items-center p-4 bg-slate-100 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Test Record
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}