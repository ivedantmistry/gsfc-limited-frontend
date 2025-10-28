"use client";

import React from "react";
import { Product } from "@/lib/types/";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-lg shadow-sm p-4 h-full hover:shadow-md cursor-pointer transition-shadow space-y-1"
    >
      <h3
        className="font-medium text-gray-900 truncate"
        title={product.name}
      >
        {product.name}
      </h3>
      <p className="font-mono text-sm text-gray-700">
        {product.product_id}
      </p>
    </div>
  );
};

// Skeleton for loading state
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};