"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/lib/api/products";
import { useHasPermission } from "@/hooks/useHasPermission";
import AddProductModal from "@/components/inventory/AddProductModal";
import { ProductTable } from "@/components/inventory/products/ProductTable";
import { Search, Plus } from "lucide-react";

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { products, isLoading, error, mutate } =
    useProducts(debouncedSearchTerm);
  const canManageProducts = useHasPermission("inventory.can_manage_products");

  const handleModalClose = () => {
    setIsModalOpen(false);
    mutate();
  };

  return (
    <>
      <AddProductModal isOpen={isModalOpen} onClose={handleModalClose} />

      {/* REVAMPED: Main container with a clean layout */}
      <div className="space-y-6">
        {/* NEW: A dedicated toolbar for the page title, search, and primary actions, mimicking a native app */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Product Inventory
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
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
            {canManageProducts && (
              // REVAMPED: Button is now a clean, macOS-style icon-only button for adding new items
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

        {/* NEW: The product table is now wrapped in a clean, bordered panel, consistent with the dashboard widgets */}
        <div className="bg-white/80 rounded-xl border border-slate-200/70">
          <ProductTable
            products={products}
            isLoading={isLoading}
            error={error}
            canManage={canManageProducts}
          />
        </div>
      </div>
    </>
  );
}
