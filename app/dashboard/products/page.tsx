"use client";

import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Product } from "@/lib/types/products";
import { PaginatedResponse } from "@/lib/types";
import { useHasPermission } from "@/hooks/useHasPermission";
import AddProductModal from "@/components/inventory/AddProductModal"; ``
import {
  HardDrive,
  PlusCircle,
  Edit,
  ChevronRight,
  ChevronDown,
} from "lucide-react";


const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="p-4 w-12">
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-2/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </td>
  </tr>
);

const ProductRow = ({
  product,
  canManage,
}: {
  product: Product;
  canManage: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50/70">
        <td className="px-4 py-2 text-center">
          {product.grades.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
        </td>
        <td className="px-6 py-4 font-mono text-gray-800">
          {product.product_id}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
        <td className="px-6 py-4 text-gray-500">
          {product.grades.length > 0
            ? `${product.grades.length} Grade(s)`
            : "No Grades"}
        </td>
        <td className="px-6 py-4 text-gray-500">
          {new Date(product.created_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4">
          {canManage && (
            <Link href={`/dashboard/products/${product.id}`}>
              <span
                className="p-2 rounded-md hover:bg-gray-200 inline-block"
                title="View/Edit Product"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </span>
            </Link>
          )}
        </td>
      </tr>
      {isExpanded && product.grades.length > 0 && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="p-0">
            <div className="px-10 py-4">
              <h4 className="font-semibold text-xs text-gray-600 uppercase mb-2">
                Associated Grades
              </h4>
              <ul className="divide-y divide-gray-200">
                {product.grades.map((grade) => (
                  <li
                    key={grade.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-800">{grade.name}</span>
                    <span className="text-xs text-gray-500">
                      {grade.description || "No description"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

    const {
    data: paginatedData,
    error,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<Product>>(
    "/inventory/products/",
    getProducts // UPDATE: Use the imported getProducts function here
  );

  const products = paginatedData?.results;
  const canManageProducts = useHasPermission("inventory.can_manage_products");

  // Function to handle closing the modal and refreshing the product list
  const handleModalClose = () => {
    setIsModalOpen(false);
    mutate(); // Re-fetch the product list to show the new entry
  };

  return (
    <>
      {/* The modal is now part of the page, but only visible when isModalOpen is true */}
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
            // This button now opens the modal instead of being a Link
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium shadow transition-transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              Add Product
            </button>
          )}
        </header>

        {/* The rest of the table remains the same... */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs text-gray-700 uppercase tracking-wider">
              <tr>
                <th scope="col" className="w-12 p-4"></th>
                <th scope="col" className="px-6 py-3">
                  Product ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Grades
                </th>
                <th scope="col" className="px-6 py-3">
                  Created
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              {error && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-red-500">
                    Failed to load products.
                  </td>
                </tr>
              )}
              {!isLoading && products && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <HardDrive className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="font-medium">No products found.</h3>
                    <p className="text-xs mt-1">
                      Get started by adding a new product.
                    </p>
                  </td>
                </tr>
              )}
              {!isLoading &&
                products?.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    canManage={canManageProducts}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
