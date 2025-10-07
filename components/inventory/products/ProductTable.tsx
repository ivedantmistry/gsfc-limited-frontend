// src/components/inventory/products/ProductTable.tsx

"use client";

import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/types/";

interface ProductTableProps {
  products?: Product[];
  isLoading: boolean;
  canManage: boolean;
}

export const ProductTable = ({ products, isLoading }: ProductTableProps) => {
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader></TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Product ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Active Version</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  router.push(`/dashboard/products/${product.id}/versions`)
                }
              >
                <TableCell className="font-mono">
                  {product.product_id}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.active_version_name || "N/A"}</TableCell>
                <TableCell>
                  {format(new Date(product.created_at), "dd MMM yyyy")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
