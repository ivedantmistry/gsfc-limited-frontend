import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ChevronRight, Plus } from "lucide-react";

type VersionListHeaderProps = {
  product: Product;
  onAddNew: () => void;
};

export const VersionListHeader: React.FC<VersionListHeaderProps> = ({
  product,
  onAddNew,
}) => {
  return (
    <>
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

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Version History for {product.name}
        </h1>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700"
        >
          <Plus size={16} /> Create New Version
        </button>
      </div>
    </>
  );
};