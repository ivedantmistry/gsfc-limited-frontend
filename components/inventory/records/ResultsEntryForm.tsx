// src/components/inventory/records/ResultsEntryForm.tsx
"use client";

import React from "react";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TestRecord,
  TestResultInput,
  // ✅ FIX 1: Removed unused 'ResultsFormInput'
} from "@/lib/types/test.types";
import { ParameterDefinition } from "@/lib/types/product.types";
import { updateTestRecordResults } from "@/lib/api/test";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useVersion } from "@/lib/api/version";
import { useSWRConfig } from "swr";

// This builds the schema as before
const buildSchema = (parameters: ParameterDefinition[]) => {
  const shape: { [key: string]: z.ZodTypeAny } = {};
  parameters.forEach((param) => {
    let validator: z.ZodTypeAny;
    switch (param.data_type) {
      case "INTEGER":
      case "DECIMAL":
        validator = z.coerce.number();
        break;
      case "BOOLEAN":
        validator = z.boolean().default(false);
        break;
      default:
        validator = z.string();
    }
    if (param.is_required) {
      validator = validator.refine(
        (val) => val !== "" && val !== undefined && val !== null,
        {
          message: "A value is required.",
        }
      );
    } else {
      validator = validator.optional();
    }
    shape[String(param.id)] = validator;
  });
  return z.object({ results: z.object(shape) });
};

// Create a type from the Zod schema's return type
type FormSchemaType = z.input<ReturnType<typeof buildSchema>>;

const renderParameterInput = (
  param: ParameterDefinition,
  control: Control<FormSchemaType>
) => {
  const fieldName = `results.${param.id}` as const;
  switch (param.data_type) {
    case "INTEGER":
    case "DECIMAL":
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  {...field}
                  // ✅ FIX 2 (Line 94): Cast 'value' to what the Input expects
                  value={(field.value as string | number) ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : +e.target.value
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "ENUM":
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                // ✅ FIX 3 (Line 117): Cast 'defaultValue' to what Select expects
                defaultValue={field.value as string | undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {param.enum_options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
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
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Switch
                  // ✅ FIX 4 (Line 145): Cast 'checked' to what Switch expects
                  checked={field.value as boolean | undefined}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      );
    default:
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  // ✅ FIX 5 (Line 161): Cast 'value' to what Input expects
                  value={(field.value as string) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
  }
};

interface ResultsEntryFormProps {
  testRecord: TestRecord;
}

export default function ResultsEntryForm({
  testRecord,
}: ResultsEntryFormProps) {
  const { mutate } = useSWRConfig();
  const { version: versionData, isLoading: isLoadingVersion } = useVersion(
    testRecord.version
  );

  const parametersToRender =
    testRecord.product_grade && versionData?.grades
      ? versionData.grades.find((g) => g.id === testRecord.product_grade)
          ?.parameters || []
      : versionData?.parameters || [];

  const formSchema = buildSchema(parametersToRender);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      results: testRecord.parameter_values.reduce(
        (
          acc: Record<string, string | number | boolean | null | undefined>,
          pv
        ) => {
          acc[String(pv.parameter.id)] = pv.display_value;
          return acc;
        },
        {}
      ),
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const results_input: TestResultInput[] = Object.entries(data.results)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([paramId, value]) => ({
        parameter: Number(paramId),
        // ✅ FIX 6 (Line 206): Remove 'as any'
        value: value as string | number | boolean | null,
      }));
    const swrKey = `/inventory/tests/${testRecord.id}/`;
    try {
      const updatedRecord = await updateTestRecordResults(testRecord.id, {
        results_input,
      });
      toast.success("Test results have been saved.");
      mutate(swrKey, updatedRecord, false);
      // ✅ FIX 7 (Line 215): Remove unused 'error' variable
    } catch {
      toast.error("Failed to save results.");
    }
  };
  if (isLoadingVersion) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              Enter Test Results
            </h3>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Results
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Expected Range</TableHead>
                <TableHead>Actual Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parametersToRender.length > 0 ? (
                parametersToRender.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell className="font-medium">{param.name}</TableCell>
                    <TableCell>
                      {param.min_value && param.max_value
                        ? `${param.min_value} - ${param.max_value} ${
                            param.unit || ""
                          }`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {renderParameterInput(param, form.control)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No parameters defined for this test specification.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </form>
    </Form>
  );
}
