// src/api/product.ts

import useSWR from "swr";
import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";
// ✅ 1. Import BOTH Product and the new ProductListItem
import { Product, ProductListItem } from "@/lib/types";

const PRODUCTS_ENDPOINT = "/inventory/products/";

// ✅ 2. Update listFetcher to expect the lightweight type
const listFetcher = (url: string) =>
  api.get<PaginatedResponse<ProductListItem>>(url).then((res) => res.data);

// This fetcher is for a single, HEAVY product. It is correct.
const singleFetcher = (url: string) =>
  api.get<Product>(url).then((res) => res.data);

/**
 * Fetches a paginated list of all products.
 * This hook is now lightweight and used by BOTH the
 * main product list and the search modal.
 */
export function useProducts(params: {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}) {
  const urlParams = new URLSearchParams();
  if (params.searchTerm) urlParams.append("search", params.searchTerm);
  if (params.page) urlParams.append("page", params.page.toString());
  if (params.pageSize)
    urlParams.append("page_size", params.pageSize.toString());

  const url = `${PRODUCTS_ENDPOINT}?${urlParams.toString()}`;

  // ✅ 3. Update SWR to use the new lightweight type
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<ProductListItem>
  >(url, listFetcher, { keepPreviousData: true });

  return {
    // data.results is now correctly typed as ProductListItem[]
    products: data?.results,
    totalCount: data?.count,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetches a single HEAVY product by its ID.
 * (Used by Step 2 of the wizard and product detail pages)
 */
export function useProduct(productId: string | number | null) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    productId ? `${PRODUCTS_ENDPOINT}${productId}/` : null,
    singleFetcher
  );

  return {
    product: data,
    isLoading,
    error,
    mutate,
  };
}

// ✅ 4. The broken useAllProducts() hook has been deleted.
