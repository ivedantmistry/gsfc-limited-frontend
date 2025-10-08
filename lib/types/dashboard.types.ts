// src/types/dashboard.types.ts

// Represents a single, aggregated data point for a day from the backend
export interface AggregatedDataPoint {
  date: string;
  avg: number;
  min: number;
  max: number;
}

// Represents the trend data for one parameter, containing aggregated points
export interface AggregatedTrend {
  id: number;
  name: string;
  unit: string | null;
  min_value: string | null; // The overall specification min
  max_value: string | null; // The overall specification max
  data_points: AggregatedDataPoint[];
}

// The top-level structure for the dashboard data
export interface ProductHealth {
  product_id: number;
  product_name: string;
  active_version_id: number;
  active_version_name: string;
  last_updated_at: string | null;
  trends: AggregatedTrend[];
}
