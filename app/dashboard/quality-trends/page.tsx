"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/lib/api/product";
import { Product } from "@/lib/types";


// UI Components
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PaginationControls from "@/components/shared/PaginationControls";
import { Search } from "lucide-react";

export default function QualityTrendsProductListPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "24");
  const initialSearch = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  // Debouncing for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { products, totalCount, isLoading, error } = useProducts({
    page,
    pageSize,
    searchTerm: debouncedSearchTerm,
    isActive: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Product Health Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time quality overview of active product versions.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Product Name or ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">Failed to load products.</p>}
      
      {!isLoading && products && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <Link
                key={product.id}
                href={`/dashboard/quality-trends/${product.id}`}
                passHref
              >
                <Card className="h-full hover:shadow-md hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.product_id}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <PaginationControls
            currentPage={page}
            pageSize={pageSize}
            totalCount={totalCount || 0}
          />
        </>
      )}
    </div>
  );
}