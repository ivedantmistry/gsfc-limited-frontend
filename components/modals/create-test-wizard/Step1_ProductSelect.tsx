"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAllProducts } from "@/lib/api/product";
import { Product } from "@/lib/types/product.types";

interface Step1_ProductSelectProps {
  onSelectProduct: (product: Product) => void;
}

export default function Step1_ProductSelect({
  onSelectProduct,
}: Step1_ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, isLoading } = useAllProducts();

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setOpen(false);
  };

  return (
    <>
      <DialogHeader className="p-6 pb-4 border-b">
        <DialogTitle className="text-lg font-semibold">
          Step 1: Select a Product
        </DialogTitle>
        <DialogDescription>
          Search for and select the product you are testing.
        </DialogDescription>
      </DialogHeader>
      <div className="p-6 space-y-6">
        <p className="text-sm font-medium text-slate-700">Product</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-11 bg-white"
            >
              {selectedProduct
                ? `${selectedProduct.name} (${selectedProduct.product_id})`
                : "Select a product..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search product name or ID..." />
              <CommandEmpty>
                {isLoading ? "Loading..." : "No product found."}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {products?.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.name} ${product.product_id}`}
                    onSelect={() => handleSelect(product)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProduct?.id === product.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {product.name} ({product.product_id})
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end p-4 bg-slate-100 border-t">
        <Button
          onClick={() => onSelectProduct(selectedProduct!)}
          disabled={!selectedProduct}
        >
          Next
        </Button>
      </div>
    </>
  );
}