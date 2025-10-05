// src/components/modals/create-test-wizard/Step1_ProductSelect.tsx
"use client";

import React from "react";
// ✅ NEW: Imported useRef, useEffect for shortcut and Command icon
import { useState, useRef, useEffect } from "react"; 
import { Check, Package, Search, Command as CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ✅ FIX: Using standard Input now
import {
  Command,
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
  
  // ✅ NEW: Added a ref for the search input to control focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ✅ NEW: Effect to focus the input on modal open (improves UX)
  useEffect(() => {
    // Timeout helps ensure the element is rendered and ready to be focused
    setTimeout(() => {
        searchInputRef.current?.focus();
    }, 100);
  }, []);

  // ✅ NEW: Keyboard shortcut logic inspired by your RecordFilters component
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
    setSelectedProduct(product);
    setSearchQuery(`${product.name} (${product.product_id})`);
  };
  
  const filteredProducts =
    searchQuery && products
      ? products.filter(
          (product) =>
            (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.product_id.toLowerCase().includes(searchQuery.toLowerCase())) &&
            product.id !== selectedProduct?.id // Don't show the selected one in the list
        )
      : [];

  return (
    <>
      <DialogHeader className="p-6 pb-4 border-b bg-white">
        <DialogTitle className="text-xl font-bold text-slate-800 flex items-center">
          <Package className="mr-3 h-6 w-6 text-indigo-600" />
          Step 1: Select a Product
        </DialogTitle>
        <DialogDescription>
          Search for the product by its name or ID.
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 space-y-3">
        <label className="text-sm font-medium text-slate-700">Product Search</label>
        
        {/* ✅ FIX & REFACTOR: Replaced the Command wrapper with a simple div and a standard Input for clean styling */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            ref={searchInputRef}
            placeholder="Start typing to search..."
            className="h-11 w-full rounded-md border pl-10 pr-12 text-base shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* ✅ NEW: Added the keyboard shortcut hint */}
          <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-1 rounded border bg-slate-100 px-2 py-1 text-xs text-slate-500">
            <CommandIcon className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* The result list remains, but now it's cleaner */}
        {searchQuery.length > 0 && filteredProducts.length > 0 && (
            <Command className="rounded-lg border shadow-sm">
                <CommandList>
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
                    ) : (
                        <CommandGroup>
                        {filteredProducts.map((product) => (
                            <CommandItem
                            key={product.id}
                            value={`${product.name} ${product.product_id}`}
                            onSelect={() => handleSelect(product)}
                            >
                            {product.name} ({product.product_id})
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>
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
    </>
  );
}