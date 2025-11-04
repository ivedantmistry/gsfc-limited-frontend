"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PackageX} from "lucide-react";
import { ProductListItem } from "@/lib/types/";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

interface ProductGridProps {
  products?: ProductListItem[];
  isLoading: boolean;
  canManage: boolean;
}

export const ProductGrid = ({
  products,
  isLoading,
  canManage,
}: ProductGridProps) => {
  const router = useRouter();

  // Skeletons while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 bg-white border rounded-lg shadow-sm text-center p-6">
        <PackageX className="h-10 w-10 text-gray-400 mb-2" />
        <h3 className="text-base font-semibold text-slate-800">
          No products found
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {canManage
            ? "You can add a new product to get started."
            : "No products available to display."}
        </p>
      </div>
    );
  }

  // Product grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => router.push(`/dashboard/products/${product.id}/`)}
        />
      ))}
    </div>
  );
};
