"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/lib/api/product";
import { useHasPermission } from "@/hooks/useHasPermission";
import AddProductModal from "@/components/inventory/AddProductModal";
import { ProductTable } from "@/components/inventory/products/ProductTable";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

// NEW: Define the type for the props our PaginationControls component expects.
interface PaginationControlsProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number | undefined;
  nextPageUrl: string | null | undefined;
  prevPageUrl: string | null | undefined;
  productsLength: number;
}

// A dedicated component for all pagination controls.
const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalCount,
  nextPageUrl,
  prevPageUrl,
  productsLength,
}) => {
  const pageSizes = [10, 25, 50, 75, 100];
  // Fallback to 0 if totalCount is undefined
  const count = totalCount || 0;
  const startItem = count > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = startItem + productsLength - 1;

  return (
    <div className="flex items-center justify-between p-4 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="bg-white border border-slate-300 rounded-md p-1.5"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="font-medium">
        {startItem}–{endItem} of {count}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!prevPageUrl}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!nextPageUrl}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const {
    products,
    totalCount,
    nextPageUrl,
    prevPageUrl,
    isLoading,
    error,
    mutate,
  } = useProducts({ searchTerm: debouncedSearchTerm, page, pageSize });

  const canManageProducts = useHasPermission("inventory.can_manage_products");

  const handleModalClose = () => {
    setIsModalOpen(false);
    mutate();
  };

  return (
    <>
      <AddProductModal isOpen={isModalOpen} onClose={handleModalClose} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900">
              Product Inventory
            </h1>
            
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Total Count beside the search bar */}
            {!isLoading && totalCount !== undefined && (
              <span className="bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                Total Products: {totalCount} 
              </span>
            )}
            {isLoading && (
              <div className="h-7 w-20 bg-slate-200 rounded-full animate-pulse" />
            )}

            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 bg-white py-2 pl-9 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Product Button */}
            {canManageProducts && (
              <button
                onClick={() => setIsModalOpen(true)}
                title="Add New Product"
                className="inline-flex items-center gap-2 rounded-md bg-white text-slate-800 font-medium px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/80 rounded-xl border border-slate-200/70">
          <ProductTable
            products={products}
            isLoading={isLoading}
            error={error}
            canManage={canManageProducts}
          />
          {/* FIXED: The condition now safely checks if totalCount is a positive number. */}
          {totalCount && totalCount > 0 && (
            <PaginationControls
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={totalCount}
              nextPageUrl={nextPageUrl}
              prevPageUrl={prevPageUrl}
              productsLength={products?.length || 0}
            />
          )}
        </div>
      </div>
    </>
  );
}
