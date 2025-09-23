import useSWR from "swr";
import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";
import { Product } from "@/lib/types/products";

// The actual API endpoint is now a private constant within this file
const PRODUCTS_ENDPOINT = "/inventory/products/";

// The fetcher function is also kept private here
const fetcher = async (url: string): Promise<PaginatedResponse<Product>> => {
  const response = await api.get<PaginatedResponse<Product>>(url);
  return response.data;
};

/**
 * Custom hook to fetch the list of products.
 * This encapsulates all the data-fetching logic (SWR, endpoint, fetcher).
 */
export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR(PRODUCTS_ENDPOINT, fetcher);

  return {
    paginatedData: data,
    products: data?.results,
    isLoading,
    error,
    mutate,
  };
}

// The createProduct function can remain the same
type CreateProductData = Pick<Product, "name" | "product_id"> & {
  grades?: Pick<Product["grades"][0], "name" | "description">[];
};

export const createProduct = async (
  productData: CreateProductData
): Promise<Product> => {
  const response = await api.post<Product>(PRODUCTS_ENDPOINT, productData);
  return response.data;
};
