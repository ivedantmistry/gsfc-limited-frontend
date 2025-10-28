// src/app/dashboard/products/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react"; 
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/api/product";
import { useHasPermission } from "@/context/AuthContext";
import AddProductModal from "@/components/modals/AddProductModal";
import { ProductTable } from "@/components/inventory/products/ProductTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Command, PlusCircle } from "lucide-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");
  const initialSearch = searchParams.get("search") ?? "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      searchInputRef.current?.blur();
    }
  };

  const { products, totalCount, isLoading, error, mutate } = useProducts({
    searchTerm: debouncedSearchTerm,
    page,
    pageSize,
  });

  const canManageProducts = useHasPermission("inventory.can_manage_products");

  const handleModalClose = () => {
    setIsModalOpen(false);
    mutate();
  };

  return (
    <>
      <AddProductModal isOpen={isModalOpen} onClose={handleModalClose} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              All Products
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Browse and manage all product testing blueprints.
            </p>
          </div>
          {canManageProducts && (
            <Button
             className="text-indigo-600 bg-white hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-300 shadow-sm transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Product
            </Button>
          )}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            ref={searchInputRef}
            placeholder="Search products..."
            className="pl-10 pr-20 h-10 w-full rounded-md border border-input bg-white text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-xs text-muted-foreground bg-muted border rounded px-2 py-0.5 h-5">
            <Command className="w-3.5 h-3.5" />{" "}
            {/* Command icon from lucide-react */}
            <span className="font-mono text-[0.7rem]">K</span>
          </div>
        </div>

        <ProductTable
          products={products}
          isLoading={isLoading}
          canManage={canManageProducts}
        />

        {totalCount != null && totalCount > 0 && (
          <PaginationControls
            totalCount={totalCount}
            currentPage={page}
            pageSize={pageSize}
          />
        )}
      </div>
    </>
  );
}
