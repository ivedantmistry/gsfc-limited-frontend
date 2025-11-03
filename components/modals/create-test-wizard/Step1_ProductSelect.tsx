// src/components/modals/create-test-wizard/Step1_ProductSelect.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Package, Search, Command as CommandIcon } from "lucide-react";
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
import { useProducts } from "@/lib/api/product";
import { ProductListItem } from "@/lib/types/product.types";

interface Step1_ProductSelectProps {
  onSelectProduct: (productId: number, productName: string) => void;
}

export default function Step1_ProductSelect({
  onSelectProduct,
}: Step1_ProductSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductListItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const {
    products,
    isLoading,
    // ✅ FIX 1 (Line 41): Removed 'error: productsError' as it was unused
  } = useProducts({
    searchTerm: debouncedSearchTerm,
    pageSize: 50,
    isActive: true,
  });

  useEffect(() => {
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProduct) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProduct(null);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown, true);
    };
  }, [selectedProduct]);

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

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
    const item = document.getElementById(`product-item-${activeIndex}`);
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = (product: ProductListItem) => {
    setSelectedProduct(product);
    setSearchQuery(product.name);
    setShowResults(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (selectedProduct) setSelectedProduct(null);
    setShowResults(value.length > 0);
    setActiveIndex(0);
  };

  const filteredProducts: ProductListItem[] = products || [];
  // ✅ FIX 2 (Line 108): Removed unused 'isSearching' variable

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const resultsCount = filteredProducts.length;
    if (resultsCount === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % resultsCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + resultsCount) % resultsCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedProduct) {
        onSelectProduct(selectedProduct.id, selectedProduct.name);
      } else if (filteredProducts[activeIndex]) {
        handleSelect(filteredProducts[activeIndex]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="p-6 pb-4 border-b bg-white">
        <DialogTitle className="text-xl font-bold text-slate-800 flex items-center">
          <Package className="mr-3 h-6 w-6 text-indigo-600" />
          Step 1: Select a Product
        </DialogTitle>
        <DialogDescription>
          Search for the product by its name or ID. Note: Products with active
          versions are shown.
        </DialogDescription>
      </DialogHeader>

      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          showResults ? "h-[60vh]" : "h-auto"
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
              onBlur={() => {
                setTimeout(() => setShowResults(false), 150);
              }}
              onKeyDown={handleKeyDown}
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

        {showResults && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <Command className="bg-transparent">
              <CommandList>
                {isLoading && (
                  <div className="p-4 text-center text-sm">Loading...</div>
                )}
                {!isLoading && filteredProducts.length === 0 && searchQuery && (
                  <CommandEmpty>
                    No results found for &quot;{searchQuery}&quot;
                  </CommandEmpty>
                )}
                {!isLoading && (
                  <CommandGroup>
                    {filteredProducts.map((product, index) => {
                      const isSelected = selectedProduct?.id === product.id;
                      return (
                        <CommandItem
                          id={`product-item-${index}`}
                          key={product.id}
                          value={`${product.name} (${product.product_id})`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelect(product);
                          }}
                          onSelect={() => handleSelect(product)}
                          className={cn(
                            "flex-col items-start border-b py-2 cursor-pointer rounded-md transition-colors",
                            {
                              "bg-indigo-500 text-white": isSelected,
                              "bg-slate-100":
                                activeIndex === index && !isSelected,
                            }
                          )}
                        >
                          <span
                            className={cn(
                              isSelected ? "text-white" : "text-slate-800"
                            )}
                          >
                            {product.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs",
                              isSelected ? "text-indigo-200" : "text-slate-500"
                            )}
                          >
                            {product.product_id}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      <div className="flex justify-end p-4 bg-slate-100 border-t mt-auto">
        <Button
          onClick={() =>
            onSelectProduct(selectedProduct!.id, selectedProduct!.name)
          }
          disabled={!selectedProduct}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
