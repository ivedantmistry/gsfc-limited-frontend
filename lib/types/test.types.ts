// src/types/test.types.ts
import { ParameterDefinition } from "./product.types";

/**
 * Represents a read-only test result for display.
 * Matches TestResultDisplaySerializer.
 */
export interface TestResultDisplay {
  id: number;
  parameter: ParameterDefinition;
  display_value: string | number | boolean | null;
  status: "IN_SPEC" | "OUT_OF_SPEC";
}

/**
 * Represents the data structure for submitting a test result.
 * Matches TestResultInputSerializer.
 */
export interface TestResultInput {
  parameter: number; // The ID of the ParameterDefinition
  value: string | number | boolean | null;
}

export interface RelatedTestRecord {
  id: number;
  record_id: string;
}

export interface RelatedAlert {
  id: number;
  alert_id: string;
}
/**
 * Represents a full Test Record received from the API.
 * Matches TestRecordSerializer.
 */
export interface TestRecord {
  id: number;
  record_id: string;
  version: number;
  lab: number;
  lab_name: string;
  product_grade: number | null;
  sample_id: string;
  batch_no: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "RETEST_ORDERED";
  analyst: number | null;
  analyst_full_name: string | null;
  supervisor_comments: string | null;
  approved_by: number | null;
  approved_by_full_name: string | null;
  approved_at: string | null;
  closed_by: number | null;
  closed_at: string | null;
  closed_by_full_name: string | null;
  retest_ordered_by: number | null;
  retest_ordered_at: string | null;
  retest_ordered_by_full_name: string | null;
  created_at: string;
  updated_at: string;
  product_name: string;
  product_grade_name: string | null;
  parameter_values: TestResultDisplay[];
  retest_record_id: string | null;
  retest_of: RelatedTestRecord | null;
  retests: RelatedTestRecord[];
  alerts: RelatedAlert[];
}

/**
 * Represents the data structure for creating a new Test Record.
 */
export interface TestRecordInput {
  version: number;
  lab: number;
  product_grade?: number | null;
  sample_id: string;
  batch_no: string;
  results_input: TestResultInput[];
}
/**
 * ✅ NEW: Represents a lightweight test record for list/table views.
 * Matches RecentTestRecordSerializer and HistoricalTestRecordSerializer.
 */
export interface TestRecordInList {
  id: number;
  record_id: string;
  product_name: string;
  analyst_full_name: string | null;
  created_at: string;
  lab_name: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "RETEST_ORDERED";
}

/**
 * ✅ NEW: Represents the data structure for the editable results form.
 */
export interface ResultsFormInput {
  results: {
    [key: string]: string | number | boolean;
  };
}
