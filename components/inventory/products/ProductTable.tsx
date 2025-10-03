// src/components/inventory/products/ProductTable.tsx

"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/types/";
import { MoreHorizontal, Edit, Eye } from "lucide-react";

interface ProductTableProps {
  products?: Product[];
  isLoading: boolean;
  canManage: boolean;
}

export const ProductTable = ({ products, isLoading, canManage }: ProductTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
             {/* ... (table header) ... */}
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
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
            {/* <TableHead className="w-[100px] text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono">
                   <Link href={`/dashboard/products/${product.id}/versions`} className="hover:underline">{product.product_id}</Link>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.active_version_name || "N/A"}</TableCell>
                <TableCell>{format(new Date(product.created_at), 'dd MMM yyyy')}</TableCell>
                {/* <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <Link href={`/dashboard/products/${product.id}/versions`}>
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Versions</DropdownMenuItem>
                       </Link>
                      {canManage && (
                        <Link href={`/dashboard/products/${product.id}`}>
                           <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit Product</DropdownMenuItem>
                        </Link>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}
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