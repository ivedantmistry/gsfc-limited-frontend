"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useProduct } from "@/lib/api/product";
import {
  useVersions,
  createVersion,
  lockVersion,
  activateVersion,
  createNewVersionFromExisting,
} from "@/lib/api/version";
import { CreateVersionModal } from "@/components/modals/CreateVersionModal";
import {
  ChevronRight,
  Plus,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ShieldCheck,
} from "lucide-react";

// Helper to format dates
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// --- Main Page Component ---
export default function VersionManagementPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId;

  const { product, isLoading: isProductLoading } = useProduct(productId);
  const {
    versions,
    isLoading: areVersionsLoading,
    mutate: mutateVersions,
  } = useVersions(productId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- API Handlers ---
  const handleCreate = async (versionName: string) => {
    await createVersion({ product: Number(productId), version_name: versionName });
    mutateVersions();
    setIsModalOpen(false);
  };

  const handleLock = async (versionId: number) => {
    if (window.confirm("Locking a version is permanent. Are you sure?")) {
      await lockVersion(versionId);
      mutateVersions();
    }
  };

  const handleActivate = async (versionId: number) => {
    if (
      window.confirm(
        "Set this as the active version? This will deactivate any other active version."
      )
    ) {
      await activateVersion(versionId);
      mutateVersions();
    }
  };

  const handleClone = async (versionId: number) => {
    await createNewVersionFromExisting(versionId);
    mutateVersions();
  };

  const handleDelete = async (versionId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this draft version? This action cannot be undone."
      )
    ) {
      alert(
        `(Placeholder) Deleting version ${versionId}. You'll need to implement deleteVersion in api/version.ts.`
      );
      // await deleteVersion(versionId);
      mutateVersions();
    }
  };

  const isLoading = isProductLoading || areVersionsLoading;

  if (isLoading) return <div>Loading Versions...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <>
      <CreateVersionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onSuccess={handleCreate}
      />

      <div className="space-y-6">
        {/* ✅ BREADCRUMBS UPDATED HERE */}
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
                  href={`/dashboard/products/${product.id}`}
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
                  Version History
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Title and Actions */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Version History for {product.name}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700"
          >
            <Plus size={16} /> Create New Version
          </button>
        </div>

        {/* Versions Table */}
        <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Version Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Created On
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {versions?.map((version) => (
                <tr key={version.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/products/${product.id}/versions/${version.id}`}
                      className="font-semibold text-indigo-600 hover:underline"
                    >
                      {version.version_name}
                    </Link>
                    {version.is_active && (
                      <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <ShieldCheck size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        version.status === "DRAFT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {version.status === "DRAFT" ? (
                        <Unlock size={12} />
                      ) : (
                        <Lock size={12} />
                      )}
                      {version.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(version.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      {version.status === "DRAFT" && (
                        <>
                          <button
                            onClick={() => handleLock(version.id)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Lock Version"
                          >
                            Lock
                          </button>
                          <button
                            onClick={() => handleDelete(version.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Draft"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {version.status === "LOCKED" && !version.is_active && (
                        <button
                          onClick={() => handleActivate(version.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Set as Active"
                        >
                          Activate
                        </button>
                      )}
                      {version.status === "LOCKED" && (
                        <button
                          onClick={() => handleClone(version.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Clone Version"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}