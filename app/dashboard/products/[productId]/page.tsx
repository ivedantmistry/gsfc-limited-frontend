"use client";

import React, { use } from "react";
import Link from "next/link";
import { useProduct } from "@/lib/api/product";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function ProductOverviewPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const { product, isLoading } = useProduct(resolvedParams.productId);

  if (isLoading) return <div>Loading Product Overview...</div>;
  if (!product) return <div>Product not found.</div>;

  const activeVersion = product.versions.find((v) => v.is_active);

  return (
    <div className="space-y-6">
      {/* ✅ BREADCRUMBS ADDED */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link
              href="/dashboard/products"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600"
            >
              Products
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {/* ✅ PAGE TITLE IS NOW DYNAMIC */}
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <Link
            href={`/dashboard/products/${product.id}/versions`}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700"
          >
            Manage All Versions
          </Link>
        </div>
      </div>

      <div className="space-y-2">

        {activeVersion ? (
            <Link
            href={`/dashboard/products/${product.id}/versions/${activeVersion.id}`}
            className="block group"
          >
            <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm group-hover:ring-2 group-hover:ring-indigo-500 group-hover:shadow-md transition-all">
              <div className="p-4 bg-slate-50 rounded-t-xl flex justify-between items-center border-b border-slate-200/70">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="font-bold text-indigo-700 group-hover:underline">
                      {activeVersion.version_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      This is the current standard for all new tests. Click to
                      view details.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 text-sm text-slate-600">
                {/* You can add more details about the active version here if needed */}
                <p>
                  <strong>Description:</strong>{" "}
                  {activeVersion.description || "No description provided."}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-center p-8 bg-white/80 rounded-xl border-2 border-dashed border-slate-300">
            <p className="font-semibold text-slate-700">No Active Version</p>
            <p className="text-sm text-slate-500">
              There is no active blueprint for this product. Go to "Manage All
              Versions" to activate one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}