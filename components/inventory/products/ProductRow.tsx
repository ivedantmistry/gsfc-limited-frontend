"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Edit } from "lucide-react";
import { Product } from "@/lib/types/products";

interface ProductRowProps {
  product: Product;
  canManage: boolean;
}

export const ProductRow = ({ product, canManage }: ProductRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50/70">
        <td className="px-4 py-2 text-center">
          {product.grades.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
        </td>
        <td className="px-6 py-4 font-mono text-gray-800">
          {product.product_id}
        </td>
        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
        <td className="px-6 py-4 text-gray-500">
          {new Date(product.created_at).toLocaleDateString()}
        </td>
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
      {isExpanded && product.grades.length > 0 && (
        <tr className="bg-gray-50">
          <td colSpan={5} className="p-0">
            <div className="px-10 py-4">
              <h4 className="font-semibold text-xs text-gray-600 uppercase mb-2">
                Associated Grades
              </h4>
              <ul className="divide-y divide-gray-200">
                {product.grades.map((grade) => (
                  <li
                    key={grade.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-800">{grade.name}</span>
                    <span className="text-xs text-gray-500">
                      {grade.description || "No description"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
