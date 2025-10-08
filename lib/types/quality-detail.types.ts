import { AggregatedTrend } from "./dashboard.types";

export interface GradeWithTrends {
  id: number;
  name: string;
  trends: AggregatedTrend[];
}

export interface RecentTestRecord {
  id: number;
  record_id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "RETEST_ORDERED";
  created_at: string;
}

export interface ProductQualityDetail {
  id: number;
  name: string;
  product_id: string;
  active_version_name: string;
  has_grades: boolean;
  grades: GradeWithTrends[];
  trends: AggregatedTrend[];
  recent_tests: RecentTestRecord[];
}
