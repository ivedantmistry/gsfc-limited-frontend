// /components/inventory/product-detail/ProductHeader.tsx
import Link from "next/link";
import { Product } from "@/lib/types";
import { ChevronRight } from "lucide-react";

export const ProductHeader = ({ product }: { product: Product }) => (
  <div>
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
    <div className="mt-2">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {product.name}
      </h1>
      {product.description && (
        <p className="mt-1 text-lg text-slate-600">{product.description}</p>
      )}
    </div>
  </div>
);
