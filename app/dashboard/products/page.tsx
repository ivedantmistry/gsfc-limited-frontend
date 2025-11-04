"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/api/product";
import { useHasPermission } from "@/context/AuthContext";
import AddProductModal from "@/components/modals/AddProductModal";
import { ProductGrid } from "@/components/inventory/products/ProductGrid";
import PaginationControls from "@/components/shared/PaginationControls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Command, PlusCircle, PackageSearch } from "lucide-react";

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
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
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

  const { products, totalCount, isLoading, mutate } = useProducts({
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

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-100">
              <PackageSearch className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                All Products
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Browse and manage all product testing blueprints.
              </p>
            </div>
          </div>

          {canManageProducts && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Product
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            ref={searchInputRef}
            placeholder="Search products..."
            className="pl-10 pr-20 h-10 w-full rounded-md border border-slate-300 bg-white text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded px-2 py-0.5 h-5">
            <Command className="w-3.5 h-3.5" />
            <span className="font-mono text-[0.7rem]">K</span>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          canManage={canManageProducts}
        />

        {/* Pagination */}
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
