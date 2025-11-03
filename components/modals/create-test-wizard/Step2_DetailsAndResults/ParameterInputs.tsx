// src/components/modals/create-test-wizard/Step2_DetailsAndResults/ParameterInputs.tsx

import React from "react";
import { Control } from "react-hook-form";
import { ParameterDefinition } from "@/lib/types/product.types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

// ✅ FIX 1: This shape MUST match the FULL form shape from the parent hook
type ParameterFormShape = {
  lab: string;
  batch_no: string;
  sample_id: string;
  product_grade: string;
  parameters: Record<string, unknown>; // Use 'unknown' to match the parent
};

interface ParameterInputsProps {
  control: Control<ParameterFormShape>;
  parameters: ParameterDefinition[];
  message: string;
}

const renderParameterInput = (
  param: ParameterDefinition,
  control: Control<ParameterFormShape>
) => {
  const fieldName = `parameters.${param.id}` as const;

  switch (param.data_type) {
    case "INTEGER":
    case "DECIMAL":
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {param.name}{" "}
                {param.unit && (
                  <span className="text-slate-500">({param.unit})</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  {...field}
                  // ✅ FIX 2: Add type cast for 'unknown' value
                  value={(field.value as string | number) ?? ""}
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-", "*"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : +e.target.value
                    )
                  }
                  className="focus:ring-2 focus:ring-indigo-500"
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
              <FormLabel>{param.name}</FormLabel>
              <Select
                onValueChange={field.onChange}
                // ✅ FIX 3: Add type cast for 'unknown' value
                defaultValue={field.value as string | undefined}
              >
                <FormControl>
                  <SelectTrigger className="focus:ring-2 focus:ring-indigo-500">
                    <SelectValue placeholder="Select an option" />
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white">
              <div className="space-y-0.5">
                <FormLabel>{param.name}</FormLabel>
              </div>
              <FormControl>
                <Switch
                  // ✅ FIX 4: Add type cast for 'unknown' value
                  checked={field.value as boolean | undefined}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </FormControl>
            </FormItem>
          )}
        />
      );
    case "STRING":
    default:
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{param.name}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  // ✅ FIX 5: Add type cast for 'unknown' value
                  value={(field.value as string) ?? ""}
                  className="focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
  }
};

export default function ParameterInputs({
  control,
  parameters,
  message,
}: ParameterInputsProps) {
  if (parameters.length === 0) {
    return (
      <p className="text-sm text-center text-slate-500 py-8 bg-slate-50 rounded-md">
        {message}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {parameters.map((param) => (
        <div key={param.id}>{renderParameterInput(param, control)}</div>
      ))}
    </div>
  );
}
