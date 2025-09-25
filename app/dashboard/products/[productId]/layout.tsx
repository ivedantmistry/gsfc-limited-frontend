"use client";

import React, { use } from "react"; // Import the 'use' hook
import { useProduct } from "@/lib/api/products";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ productId: string }>; // Note: params is now a Promise
}) {
  // FIX: Unwrap the params promise with React.use()
  const resolvedParams = use(params);

  const { product, isLoading } = useProduct(resolvedParams.productId);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        {/* --- BREADCRUMBS --- */}
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/dashboard/products">
            <span className="hover:underline">Products</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          {isLoading ? (
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          ) : (
            <span className="text-gray-800 font-medium">{product?.name}</span>
          )}
        </div>

        {/* --- HEADER & DESCRIPTION --- */}
        {isLoading ? (
          <>
            <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-lg animate-pulse"></div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <p className="text-gray-500 max-w-2xl">
              {product?.description ||
                "No description provided for this product."}
            </p>
          </>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}
