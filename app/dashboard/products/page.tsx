// src/app/dashboard/products/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/api/product";
import { useHasPermission } from "@/hooks/useHasPermission";
import AddProductModal from "@/components/modals/AddProductModal";
import { ProductTable } from "@/components/inventory/products/ProductTable";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "10");
  const initialSearch = searchParams.get("search") ?? "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or ID..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ProductTable
          products={products}
          isLoading={isLoading}
          canManage={canManageProducts}
        />
        
        {totalCount && totalCount > pageSize && (
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