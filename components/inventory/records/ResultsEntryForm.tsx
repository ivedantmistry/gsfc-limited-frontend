// src/components/inventory/records/EditableResultsTable.tsx

"use client";

import React from "react";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TestRecord,
  TestResultInput,
  ResultsFormInput,
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useVersion } from "@/lib/api/version";

// Dynamically build the validation schema based on parameters
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

// Helper to render the correct input based on parameter type
const renderParameterInput = (
  param: ParameterDefinition,
  control: Control<any>
) => {
  const fieldName = `results.${param.id}` as const;
  // ... (This function is the same as the one in your create-test-wizard)
  // You can copy it from there or use the code below.
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  checked={field.value}
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
                <Input type="text" {...field} />
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
  const router = useRouter();

  // ✅ 2. Fetch the detailed version data to get parameter definitions
  const { version: versionData, isLoading: isLoadingVersion } = useVersion(
    testRecord.version
  );

  // ✅ 3. Determine which parameters to render from the fetched version data
  const parametersToRender =
    testRecord.product_grade && versionData?.grades
      ? versionData.grades.find((g) => g.id === testRecord.product_grade)
          ?.parameters || []
      : versionData?.parameters || [];

  const formSchema = buildSchema(parametersToRender);

  const form = useForm<ResultsFormInput>({
    resolver: zodResolver(formSchema),
    // Set default values from existing results if they exist, otherwise empty
    defaultValues: {
      results: testRecord.parameter_values.reduce((acc, pv) => {
        acc[String(pv.parameter.id)] = pv.display_value;
        return acc;
      }, {} as { [key: string]: any }),
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ResultsFormInput) => {
    const results_input: TestResultInput[] = Object.entries(data.results)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([paramId, value]) => ({
        parameter: Number(paramId),
        value: value as any,
      }));

    try {
      await updateTestRecordResults(testRecord.id, { results_input });
      toast.success("Test results have been saved.");
      router.refresh(); // Refresh the page data
    } catch (error) {
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
