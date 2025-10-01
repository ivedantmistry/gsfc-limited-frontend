"use client";

import React, { use } from "react";
import Link from "next/link";
import { useProduct } from "@/lib/api/product";
// NOTE: You will need to create a `useVersion` hook to fetch a single version.
// import { useVersion } from "@/lib/api/version";
import { ChevronRight, Plus, Lock, Unlock, ShieldCheck } from "lucide-react";

// --- Main Page Component ---
export default function VersionDetailPage({
  params,
}: {
  params: Promise<{ productId: string; versionId: string }>;
}) {
  const resolvedParams = use(params);
  const { productId, versionId } = resolvedParams;

  // Fetch data for breadcrumbs and version details
  const { product, isLoading: isProductLoading } = useProduct(productId);
  // const { version, isLoading: isVersionLoading } = useVersion(versionId); // Implement this hook

  // --- Placeholder Data until hook is created ---
  const isLoading = isProductLoading;
  const version = {
    id: Number(versionId),
    version_name: "v1.0 Final",
    status: "DRAFT",
    is_active: false,
  };
  // --- End Placeholder Data ---

  if (isLoading) return <div>Loading Version Details...</div>;
  if (!product || !version) return <div>Data not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header and Breadcrumbs */}
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
              <Link
                href={`/dashboard/products/${product.id}/versions`}
                className="ml-1 text-sm font-medium text-slate-700 hover:text-indigo-600 md:ml-2"
              >
                {product.name}
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2">
                {version.version_name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Title and Status */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Version: {version.version_name}
          </h1>
          <div className="mt-2 flex items-center gap-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
                version.status === "DRAFT"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {version.status === "DRAFT" ? (
                <Unlock size={14} />
              ) : (
                <Lock size={14} />
              )}
              {version.status}
            </span>
            {version.is_active && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <ShieldCheck size={14} /> Active
              </span>
            )}
          </div>
        </div>
        {version.status === "DRAFT" && (
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-md bg-white text-slate-700 font-medium px-3 py-2 text-sm border border-slate-300 hover:bg-slate-50">
              <Plus size={16} /> Add Grade
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700">
              <Plus size={16} /> Add Parameter
            </button>
          </div>
        )}
      </div>

      {/* TODO: Add components to manage Parameters and Grades here */}
      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
        <h3 className="text-lg font-medium text-slate-800">
          Parameter & Grade Management
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Components to list, create, and edit parameters and grades will go
          here.
        </p>
      </div>
    </div>
  );
}
