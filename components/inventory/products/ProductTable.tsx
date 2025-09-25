import React from "react";
import { Product } from "@/lib/types/products";
import { HardDrive } from "lucide-react";
import { SkeletonRow } from "./SkeletonRow";
import { ProductRow } from "./ProductRow";

interface ProductTableProps {
  products?: Product[];
  isLoading: boolean;
  error: any;
  canManage: boolean;
}

export const ProductTable = ({
  products,
  isLoading,
  error,
  canManage,
}: ProductTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs text-gray-700 uppercase tracking-wider">
          <tr>
            <th scope="col" className="w-12 p-4"></th>
            <th scope="col" className="px-6 py-3">Product ID</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Created</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
          {error && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-red-500">
                Failed to load products.
              </td>
            </tr>
          )}
          {!isLoading && products && products.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-16 text-gray-500">
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
                canManage={canManage}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};