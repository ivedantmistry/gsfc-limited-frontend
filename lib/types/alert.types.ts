// src/types/alert.types.ts

import { TestRecord, TestResultDisplay } from "./test.types";

/**
 * The shape of the `details` JSON object inside an Alert.
 */
export interface AlertDetails {
  value_entered: number;
  normal_range: string;
  parameter_name: string;
  sample_id: string;
}

/**
 * The lifecycle statuses an Alert can have.
 */
export type AlertStatus = "NEW" | "ACKNOWLEDGED" | "RESOLVED";

/**
 * Represents a lightweight Alert object for list/table views.
 * Matches the `AlertSerializer`.
 */
export interface AlertInList {
  id: number;
  alert_id: string; 
  status: AlertStatus;
  details: AlertDetails;
  created_at: string;
  sample_id: string;
  product_name: string;
  test_record: number; // ID of the related TestRecord
}

/**
 * Represents the nested TestRecord data for an alert's context.
 * Matches the `TestRecordForAlertContextSerializer`.
 */
export interface TestRecordInAlertContext {
  id: number;
  sample_id: string;
  created_at: string;
  status: TestRecord["status"];
  results: TestResultDisplay[];
}

/**
 * Represents a full, detailed Alert object for the detail page.
 * Matches the `AlertContextSerializer`.
 */
export interface AlertDetail {
  id: number;
  alert_id: string;
  status: AlertStatus;
  details: AlertDetails;
  created_at: string;
  product_name: string;
  test_record_data: TestRecordInAlertContext;
  acknowledged_at: string | null;
  acknowledged_by_full_name: string | null;
  resolved_at: string | null;
  resolved_by_full_name: string | null;
}
