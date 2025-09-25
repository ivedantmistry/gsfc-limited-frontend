"use client";

import React from "react";
import { useProduct } from "@/lib/api/products";
import { ChevronRight, Save } from "lucide-react";
import Link from "next/link";

export default function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { productId: string };
}) {
  const { product, isLoading } = useProduct(params.productId);

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          {/* <Link href="/dashboard/inventory/products">
            <span className="hover:underline">Products</span>
          </Link> */}
          {/* <ChevronRight className="w-4 h-4 mx-1" /> */}
          {isLoading ? (
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          ) : (
            <span className="text-gray-800 font-medium">{product?.name}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {isLoading ? (
            <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
          )}
          {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
            <Save className="w-4 h-4" />
            Save Changes
          </button> */}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
