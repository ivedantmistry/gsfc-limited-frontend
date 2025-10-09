import useSWR from "swr";
import api from "@/lib/api";
import { ProductQualityDetail } from "@/lib/types/quality-detail.types"; // Import the new type

const PRODUCTS_ENDPOINT = "inventory/products/";

/**
 * Fetches all the data needed for a single product's quality detail page.
 *
 * @param productId The ID of the product to fetch.
 * @param startDate The start date for the chart data (YYYY-MM-DD).
 * @param endDate The end date for the chart data (YYYY-MM-DD).
 */
export function useProductQualityDetail(
  productId: number | string | null,
  startDate?: string,
  endDate?: string
) {
  // Construct the URL with optional date range parameters
  const urlParams = new URLSearchParams();
  if (startDate) urlParams.append("start_date", startDate);
  if (endDate) urlParams.append("end_date", endDate);
  
  const queryString = urlParams.toString();
  
  // SWR will not fetch if productId is null
  const url = productId
    ? `${PRODUCTS_ENDPOINT}${productId}/quality-details/?${queryString}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<ProductQualityDetail>(
    url,
    (url: string) => api.get(url).then((res) => res.data)
  );

  return {
    productDetail: data,
    isLoading,
    error,
    mutate,
  };
}