import useSWR from "swr";
import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";
import { Product, ParameterDefinition, ProductGrade } from "@/lib/types/";

// --- Endpoints ---
const PRODUCTS_ENDPOINT = "/inventory/products/";
const GRADES_ENDPOINT = "/inventory/grades/";
const PARAMETERS_ENDPOINT = "/inventory/parameters/";

// --- Fetcher Functions ---
const listFetcher = (url: string) => api.get(url).then((res) => res.data);
const singleFetcher = (url: string) => api.get(url).then((res) => res.data);

// --- Hooks ---

/**
 * Fetches a paginated list of all products, with optional search and pagination.
 * @param params An object containing searchTerm, page, and pageSize.
 */
// REVAMPED: The hook now accepts an object with pagination parameters.
export function useProducts({
  searchTerm,
  page,
  pageSize,
}: {
  searchTerm: string;
  page: number;
  pageSize: number;
}) {
  // Use URLSearchParams for clean and safe URL construction
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append("search", searchTerm);
  }
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());

  const url = `${PRODUCTS_ENDPOINT}?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    url,
    listFetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    products: data?.results,
    totalCount: data?.count,
    nextPageUrl: data?.next,
    prevPageUrl: data?.previous,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetches a single product by its ID.
 * Used for the product detail page header.
 * @param productId The ID of the product to fetch.
 */
export function useProduct(productId: string | number) {
  // SWR will not fetch if productId is null/undefined
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

/**
 * Fetches a list of parameters, filtered by EITHER a productId or a gradeId.
 * Used on the product detail page to show specs.
 * @param filters An object containing either a productId or a gradeId.
 */
export function useParameters(filters: {
  productId?: string | number;
  gradeId?: string | number;
}) {
  let url = null;
  // Construct the correct URL based on the provided filter
  if (filters.productId) {
    url = `${PARAMETERS_ENDPOINT}?product=${filters.productId}`;
  } else if (filters.gradeId) {
    url = `${PARAMETERS_ENDPOINT}?product_grade=${filters.gradeId}`;
  }

  // SWR will not begin fetching if the key (url) is null
  const { data, error, isLoading, mutate } = useSWR<ParameterDefinition[]>(
    url,
    listFetcher // The listFetcher still works perfectly
  );

  // We now return 'data' directly, as it's the array we need.
  return {
    parameters: data,
    isLoading,
    error,
    mutate,
  };
}

// Define the type for the data needed to create a new grade
type CreateGradeData = {
  name: string;
  description?: string;
};

/**
 * Creates a new Product Grade and associates it with a product.
 * @param productId The ID of the product this grade belongs to.
 * @param gradeData The data for the new grade (name, description).
 * @returns The newly created ProductGrade object.
 */
export const createProductGrade = async (
  productId: string | number,
  gradeData: CreateGradeData
) => {
  const payload = {
    ...gradeData,
    product: productId, // Add the product ID to the payload
  };
  const response = await api.post<ProductGrade>(GRADES_ENDPOINT, payload);
  return response.data;
};

// Define the type for the data needed to create a new parameter
type CreateParameterData = Omit<
  ParameterDefinition,
  "id" | "product" | "product_grade" | "enum_options"
> & {
  enum_options?: string; // Form will provide a comma-separated string
};

/**
 * Creates a new Parameter Definition.
 * It's associated with either a product or a grade based on the scope.
 * @param parameterData The data for the new parameter.
 * @param scope An object containing either a productId or a gradeId.
 */
export const createParameter = async (
  parameterData: CreateParameterData,
  scope: { productId?: string | number; gradeId?: string | number }
) => {
  const payload = {
    ...parameterData,
    product: scope.productId || null,
    product_grade: scope.gradeId || null,
    // Convert comma-separated string to an array of strings for the backend
    enum_options: parameterData.enum_options
      ? parameterData.enum_options.split(",").map((s) => s.trim())
      : null,
  };
  const response = await api.post<ParameterDefinition>(
    PARAMETERS_ENDPOINT,
    payload
  );
  return response.data;
};
