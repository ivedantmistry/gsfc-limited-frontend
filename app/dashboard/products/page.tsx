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

      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Inventory
            </h1>
            <p className="text-gray-500 mt-1">
              A list of all products and their associated grades.
            </p>
          </div>
          {canManageProducts && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium shadow transition-transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              Add Product
            </button>
          )}
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 bg-gray-100/70 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Search by name or id..."
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
