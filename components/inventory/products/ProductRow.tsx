"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Product } from "@/lib/types/";

interface ProductRowProps {
  product: Product;
  canManage: boolean;
}

export const ProductRow = ({ product, canManage }: ProductRowProps) => {
  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50/70">
        <td className="px-4 py-2 text-center"></td>
        <td className="px-6 py-4 font-mono text-gray-800">
          {product.product_id}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>

        <td className="px-6 py-4">
          {canManage && (
            <Link href={`/dashboard/products/${product.id}`}>
              <span
                className="p-2 rounded-md hover:bg-gray-200 inline-block"
                title="View/Edit Product"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </span>
            </Link>
          )}
        </td>
      </tr>
    </>
  );
};
