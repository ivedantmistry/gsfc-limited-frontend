"use client";

import React, { use } from "react";
import { useProduct } from "@/lib/api/products";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const { product, isLoading } = useProduct(resolvedParams.productId);

  return (
    <div className="space-y-6">
      {/* REVAMPED: Header and breadcrumbs updated to the new theme */}
      <header className="space-y-1">
        <div className="flex items-center text-sm text-slate-500">
          <Link href="/dashboard/inventory">
            <span className="hover:underline">Inventory</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          {isLoading ? (
            <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
          ) : (
            <span className="text-slate-700 font-semibold">
              {product?.name}
            </span>
          )}
        </div>

        {isLoading ? (
          <>
            <div className="h-9 bg-slate-200 rounded w-64 animate-pulse mt-2"></div>
            <div className="h-4 bg-slate-200 rounded w-full max-w-lg animate-pulse mt-2"></div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-slate-900">
              {product?.name}
            </h1>
            <p className="text-slate-600 max-w-2xl">
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
