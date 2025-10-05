"use client";

import React, { use } from "react";
import Link from "next/link";
import { useProduct } from "@/lib/api/product";
import { useVersion, updateVersion } from "@/lib/api/version";
import { VersionDetailView } from "@/components/inventory/version-detail/VersionDetailView";
import { ChevronRight } from "lucide-react";
import { useHasPermission } from "@/context/AuthContext";

export default function VersionDetailPage({
  params,
}: {
  params: Promise<{ productId: string; versionId: string }>;
}) {
  const resolvedParams = use(params);
  const { productId, versionId } = resolvedParams;
  const { product, isLoading: isProductLoading } = useProduct(productId);
  const {
    version,
    isLoading: isVersionLoading,
    mutate: mutateVersion,
  } = useVersion(versionId);
  const canManage = useHasPermission("inventory.can_manage_versions");
  const isLoading = isProductLoading || isVersionLoading;
  const handleNameUpdate = async (newName: string) => {
    if (!version) return;
    try {
      await updateVersion(version.id, { version_name: newName });
      mutateVersion();
    } catch (error) {
      console.error("Failed to update version name:", error);
      throw error;
    }
  };
  if (isLoading) return <div>Loading Version Details...</div>;
  if (!product || !version) return <div>Data not found.</div>;
  return (
    <div className="space-y-6">
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
      <VersionDetailView
        product={product}
        version={version}
        onDataChange={mutateVersion}
        onNameUpdate={handleNameUpdate}
        canManage={canManage} 
      />
    </div>
  );
}
