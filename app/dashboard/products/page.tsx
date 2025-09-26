"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/lib/api/products";
import { useHasPermission } from "@/hooks/useHasPermission";
import AddProductModal from "@/components/inventory/AddProductModal";
import { ProductTable } from "@/components/inventory/products/ProductTable";
import { Search, PlusCircle } from "lucide-react";

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

      <div className="space-y-8">
        {/* REVAMPED: Header typography and button styles updated for theme consistency */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Product Inventory
            </h1>
            <p className="text-slate-600 mt-1">
              A list of all products and their associated grades.
            </p>
          </div>
          {canManageProducts && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            >
              <PlusCircle className="w-5 h-5" />
              Add Product
            </button>
          )}
        </header>

        {/* REVAMPED: Search input styled to match the login page inputs */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-0 bg-white py-3 pl-11 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ProductTable
          products={products}
          isLoading={isLoading}
          error={error}
          canManage={canManageProducts}
        />
      </div>
    </>
  );
}