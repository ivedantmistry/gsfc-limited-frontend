"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createParameter } from "@/lib/api/products";
import { ParameterDefinition } from "@/lib/types/";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const DATA_TYPE_CHOICES: ParameterDefinition["data_type"][] = [
  "DECIMAL", "INTEGER", "STRING", "BOOLEAN", "ENUM"
];

const formSchema = z.object({
  name: z.string().min(1, "Parameter name is required."),
  unit: z.string().optional(),
  data_type: z.enum(DATA_TYPE_CHOICES),
  min_value: z.coerce.number().optional(),
  max_value: z.coerce.number().optional(),
});

interface AddParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  scope: { productId?: string | number; gradeId?: string | number };
  onSuccess: () => void;
}

export default function AddParameterModal({
  isOpen, onClose, scope, onSuccess
}: AddParameterModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", unit: "" },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setApiError(null);
    try {
      // @ts-ignore
      await createParameter(values, scope);
      onSuccess();
      onClose();
      form.reset();
    } catch (error: any) {
      setApiError( "An unexpected error occurred. Please try again." );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Parameter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Parameter Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Viscosity" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField name="data_type" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a data type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {DATA_TYPE_CHOICES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField name="unit" control={form.control} render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Unit</FormLabel>
                    <FormControl><Input placeholder="e.g., cP" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="min_value" control={form.control} render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Min Value</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="max_value" control={form.control} render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Max Value</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {apiError && <p className="text-sm text-red-500">{apiError}</p>}
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                Save Parameter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}