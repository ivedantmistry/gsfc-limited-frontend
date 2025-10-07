// src/types/stats.types.ts

/**
 * Represents a single data point for the quality trend graph.
 * Matches the QualityTrendDataPointSerializer.
 */
export interface QualityTrendDataPoint {
  date: string; // ISO date string
  value: string; // The decimal value, as a string
}

/**
 * Represents the complete data structure for a single parameter's trend.
 * Matches the QualityTrendSerializer.
 */
export interface QualityTrend {
  id: number;
  name: string;
  unit: string | null;
  min_value: string | null;
  max_value: string | null;
  data_points: QualityTrendDataPoint[];
}