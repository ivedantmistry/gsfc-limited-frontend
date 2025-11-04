// app/dashboard/products/[productId]/page.tsx
"use client";

import React, { use } from "react";
import Link from "next/link";
import { useProduct } from "@/lib/api/product";
import { ChevronRight, Database, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ParameterTable } from "@/components/inventory/parameters/ParameterTable";
import { ProductGradeList } from "@/components/inventory/grades/ProductGradeList";

export default function ProductOverviewPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const { product, isLoading } = useProduct(resolvedParams.productId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-1/3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!product) return <div>Product not found.</div>;

  const activeVersion = product.versions.find((v) => v.is_active);

  const hasBaseParams =
    activeVersion &&
    activeVersion.parameters &&
    activeVersion.parameters.length > 0;
  const hasGrades =
    activeVersion && activeVersion.grades && activeVersion.grades.length > 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li>
            <Link
              href="/dashboard/products"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600"
            >
              Products
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <Link
          href={`/dashboard/products/${product.id}/versions`}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700"
        >
          Manage All Versions
        </Link>
      </div>

      {/* Active Version Section */}
      <div className="space-y-2">
        {activeVersion ? (
          <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm">
            {/* Version Header */}
            <div className="p-4 bg-slate-50 rounded-t-xl flex justify-between items-center border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="font-bold text-indigo-700 text-lg">
                    {activeVersion.version_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    {activeVersion.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Parameters & Grades */}
            <div className="p-4 space-y-6">
              {hasBaseParams && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Database className="h-4 w-4 text-slate-400" /> Base
                    Parameters
                  </h3>
                  <ParameterTable parameters={activeVersion.parameters} />
                </div>
              )}

              {hasGrades && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-700">
                    Product Grades
                  </h3>
                  <ProductGradeList grades={activeVersion.grades} />
                </div>
              )}

              {!hasBaseParams && !hasGrades && (
                <div className="text-center p-6 bg-slate-50 rounded-md border-2 border-dashed border-slate-200">
                  <p className="text-sm text-slate-500">
                    This version has no parameters or grades defined.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-white/80 rounded-xl border-2 border-dashed border-slate-300">
            <p className="font-semibold text-slate-700">No Active Version</p>
            <p className="text-sm text-slate-500">
              There is no active blueprint for this product. Go to &quot;Manage
              All Versions&quot; to activate one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
