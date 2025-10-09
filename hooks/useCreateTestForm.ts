"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ParameterDefinition, VersionNested } from "@/lib/types/product.types";
import { TestRecordInput, TestResultInput } from "@/lib/types/test.types";

const buildSchema = (parameters: ParameterDefinition[]) => {
  const parameterSchema = z.object(
    Object.fromEntries(
      parameters.map((param) => {
        let validator: z.ZodTypeAny;
        switch (param.data_type) {
          case "INTEGER":
          case "DECIMAL":
            validator = z
              .union([z.string(), z.number()])
              .transform((val) => (val === "" ? undefined : Number(val)))
              .refine((val) => val === undefined || !isNaN(val), {
                message: "Must be a valid number.",
              });
            break;
          case "STRING":
          case "ENUM":
            validator = z.string().optional();
            break;
          case "BOOLEAN":
            validator = z.boolean().default(false);
            break;
          default:
            validator = z.any().optional();
        }

        if (param.is_required) {
          validator = validator.refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: "This field is required." }
          );
        }
        return [param.id, validator];
      })
    )
  );

  return z.object({
    lab: z.string().min(1, "Lab is required."),
    sample_id: z.string().min(1, "Sample ID is required."),
    batch_no: z.string().min(1, "Batch Number is required."),
    // ✅ FIX: Removed the redundant .optional() to resolve the type conflict.
    product_grade: z.string().default(""),
    parameters: parameterSchema,
  });
};

export type CreateTestFormValues = z.infer<ReturnType<typeof buildSchema>>;

export const useCreateTestForm = (
  activeVersion: VersionNested | undefined,
  selectedGradeId: string | null
) => {
  const parametersToRender = useMemo(() => {
    if (!activeVersion) return [];
    return selectedGradeId
      ? activeVersion.grades.find((g) => g.id === Number(selectedGradeId))
          ?.parameters || []
      : activeVersion.parameters || [];
  }, [activeVersion, selectedGradeId]);

  const formSchema = useMemo(() => buildSchema(parametersToRender), [
    parametersToRender,
  ]);

  const form = useForm<CreateTestFormValues>({
   resolver: zodResolver(formSchema) as any,
    defaultValues: {
      lab: "",
      sample_id: "",
      batch_no: "",
      product_grade: "",
      parameters: {},
    },
  });

  useEffect(() => {
    const { lab, sample_id, batch_no, product_grade } = form.getValues();
    form.reset({
      lab,
      sample_id,
      batch_no,
      product_grade,
      parameters: {},
    });
  }, [parametersToRender, form.reset]);

  const handleFormSubmit = async (
    values: CreateTestFormValues,
    onSubmit: (data: TestRecordInput) => Promise<void>
  ) => {
    if (!activeVersion) return;

    const results_input: TestResultInput[] = Object.entries(values.parameters)
      .map(([paramId, value]) => ({
        parameter: Number(paramId),
        value: value as any,
      }))
      .filter(
        (r) => r.value !== undefined && r.value !== null && r.value !== ""
      );

    const finalData: TestRecordInput = {
      version: activeVersion.id,
      lab: Number(values.lab),
      product_grade: selectedGradeId ? Number(selectedGradeId) : null,
      sample_id: values.sample_id,
      batch_no: values.batch_no,
      results_input: results_input,
    };

    try {
      await onSubmit(finalData);
    } catch (error: any) {
      if (error.response?.status === 400) {
        const backendErrors = error.response.data.results_input;
        if (typeof backendErrors === "object" && backendErrors !== null) {
          for (const key in backendErrors) {
            const paramId = key.split("_")[1];
            const message = backendErrors[key][0];
            if (paramId && message) {
              form.setError(`parameters.${paramId}` as any, {
                type: "manual",
                message,
              });
            }
          }
        }
      } else {
        throw error;
      }
    }
  };

  return { form, parametersToRender, handleFormSubmit };
};