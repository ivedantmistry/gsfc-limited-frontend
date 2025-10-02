// src/components/modals/create-test-wizard/Step2_DetailsAndResults/ParameterInputs.tsx

import React from "react";
import { Control } from "react-hook-form";
import { ParameterDefinition } from "@/lib/types/product.types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ParameterInputsProps {
  control: Control<any>;
  parameters: ParameterDefinition[];
  message: string;
}

// ✅ FIX: This function was missing. It contains the logic to create the correct input for each parameter.
const renderParameterInput = (param: ParameterDefinition, control: Control<any>) => {
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
          control={control}
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
          control={control}
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
          control={control}
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

export default function ParameterInputs({ control, parameters, message }: ParameterInputsProps) {
  if (parameters.length === 0) {
    return <p className="text-sm text-center text-slate-500 py-4">{message}</p>;
  }

  return (
    <div className="space-y-4">
      {parameters.map((param) => (
        <div key={param.id}>{renderParameterInput(param, control)}</div>
      ))}
    </div>
  );
}