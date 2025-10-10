// src/components/modals/create-test-wizard/Step2_DetailsAndResults/SampleDetailsForm.tsx

import React from "react";
import { Control } from "react-hook-form";
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
import { Lab } from "@/lib/api/lab";

interface SampleDetailsFormProps {
  control: Control<any>;
  labs: Lab[] | undefined;
}

export default function SampleDetailsForm({
  control,
  labs,
}: SampleDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={control}
        name="lab"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lab</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-2 focus:ring-indigo-500">
                  <SelectValue placeholder="Select a lab" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {labs?.map((lab) => (
                  <SelectItem key={lab.id} value={String(lab.id)}>
                    {lab.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="batch_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Batch Number</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                className="focus:ring-2 focus:ring-indigo-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sample_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sample ID</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                className="focus:ring-2 focus:ring-indigo-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
