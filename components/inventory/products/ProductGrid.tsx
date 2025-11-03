"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductListItem } from "@/lib/types/";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

interface ProductGridProps {
  products?: ProductListItem[];
  isLoading: boolean;
  canManage: boolean;
}

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-white border rounded-lg shadow-sm">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
