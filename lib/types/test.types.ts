// src/types/test.types.ts
import { ParameterDefinition } from "./product.types";

/**
 * Represents a read-only test result for display.
 * Matches TestResultDisplaySerializer.
 */
export interface TestResultDisplay {
  id: number;
  parameter: ParameterDefinition; // Using a simplified parameter type for display
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

/**
 * Represents a full Test Record.
 * Matches TestRecordSerializer.
 */
export interface TestRecord {
  id: number;
  record_id: string;
  version: number;
  product_grade: number | null;
  sample_id: string;
  batch_no: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETEST" | "RETEST_ORDERED";
  analyst: number | null;
  analyst_username: string;
  supervisor_comments: string | null;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  product_name: string;
  product_grade_name: string | null;
  parameter_values: TestResultDisplay[];
  retest_record_id: string | null;
  retests: string[]; // List of record_ids
}
