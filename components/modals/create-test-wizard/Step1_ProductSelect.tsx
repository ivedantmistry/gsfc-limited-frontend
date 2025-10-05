// src/components/modals/create-test-wizard/Step1_ProductSelect.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  Package,
  Search,
  Command as CommandIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, isLoading } = useAllProducts();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (product: Product) => {
    // ✅ FIX: Only update the selected product. Do NOT change the search query.
    setSelectedProduct(product);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (selectedProduct) setSelectedProduct(null); // Clear selection if user types again
    if (value.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // ✅ FIX: Added explicit Product[] type to prevent TypeScript 'never' error.
  const filteredProducts: Product[] =
    searchQuery && products
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.product_id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const isSearching = showResults && searchQuery.length > 0;

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="p-6 pb-4 border-b bg-white">
        <DialogTitle className="text-xl font-bold text-slate-800 flex items-center">
          <Package className="mr-3 h-6 w-6 text-indigo-600" />
          Step 1: Select a Product
        </DialogTitle>
        <DialogDescription>
          Search for the product by its name or ID. Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>{" "}
          to focus.
        </DialogDescription>
      </DialogHeader>

      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          isSearching ? "h-[60vh]" : "h-auto"
        )}
      >
        <div className="p-6">
          <label className="text-sm font-medium text-slate-700">
            Product Search
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchInputRef}
              placeholder="Start typing to search..."
              className="h-11 w-full rounded-md border pl-10 pr-24 text-base shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchQuery) setShowResults(true);
              }}
            />
            {searchQuery && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-12 top-1/2 h-7 -translate-y-1/2 text-xs shadow-sm"
                onClick={() => handleSearchChange("")}
              >
                Clear
              </Button>
            )}

            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-1 rounded border bg-slate-100 px-2 py-1 text-xs text-slate-500">
              <CommandIcon className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <Command className="bg-transparent">
              <CommandList>
                {isLoading && (
                  <div className="p-4 text-center text-sm">Loading...</div>
                )}
                {!isLoading && filteredProducts.length === 0 && (
                  <CommandEmpty>
                    No results found for "{searchQuery}"
                  </CommandEmpty>
                )}
                {!isLoading && (
                  <CommandGroup>
                    {filteredProducts.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={`${product.name} (${product.product_id})`}
                        onSelect={() => handleSelect(product)}
                        className={cn(
                          "flex-col items-start border-b py-2",
                          selectedProduct?.id === product.id && "bg-indigo-50"
                        )}
                      >
                        <div className="flex items-center">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProduct?.id === product.id
                                ? "opacity-100 text-indigo-600"
                                : "opacity-0"
                            )}
                          />
                          <span>{product.name}</span>
                        </div>
                        <span className="text-xs text-slate-500 ml-6">
                          {product.product_id}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      <div className="flex justify-end p-4 bg-slate-100 border-t mt-auto">
        <Button
          onClick={() => onSelectProduct(selectedProduct!)}
          disabled={!selectedProduct}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
