import { AggregatedTrend } from "./dashboard.types"; // Reuse from your dashboard types

/**
 * Represents a lightweight Test Record for the "Recent Tests" table.
 * Matches the RecentTestRecordSerializer.
 */
export interface RecentTestRecord {
  id: number;
  record_id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "RETEST_ORDERED";
  analyst_full_name: string | null;
  created_at: string; // ISO date string
}

/**
 * The complete data structure for the product quality detail page.
 * Matches the ProductQualityDetailSerializer.
 */
export interface ProductQualityDetail {
  id: number;
  name: string;
  product_id: string;
  active_version_name: string;
  trends: AggregatedTrend[];
  recent_tests: RecentTestRecord[];
}
