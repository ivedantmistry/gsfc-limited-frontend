// src/api/test.ts

import useSWR from "swr";
import api from "@/lib/api";
import { PaginatedResponse, TestRecordInList} from "@/lib/types";
import { TestRecord, TestRecordInput, TestResultInput } from "@/lib/types/";

const TESTS_ENDPOINT = "/inventory/tests/";

// Generic fetchers
const listFetcher = (url: string) => api.get(url).then((res) => res.data);
const singleFetcher = (url: string) => api.get(url).then((res) => res.data);

// ===============================================
// ==> DATA FETCHING HOOKS (SWR)
// ===============================================

/**
 * Fetches a paginated list of all test records.
 * To get pending tests for the logged-in user, you can call this hook
 * without an `analystId` and with `status: 'PENDING'`. The backend
 * logic already handles filtering by the current user if they don't have
 * the 'view all' permission.
 */
export function useTestRecords(params: {
  view_type?: "recent" | "historical";
  status?: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "RETEST_ORDERED";
  analystId?: number;
  labId?: string | null;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  date_after?: string | null;
  date_before?: string | null;
  ordering?: string | null; //
}) {
  const urlParams = new URLSearchParams();
  if (params.view_type) urlParams.append("view_type", params.view_type);

  if (params.status) urlParams.append("status", params.status);
  if (params.analystId)
    urlParams.append("analyst", params.analystId.toString());
  if (params.searchTerm) urlParams.append("search", params.searchTerm);
  if (params.page) urlParams.append("page", params.page.toString());
  if (params.pageSize)
    urlParams.append("page_size", params.pageSize.toString());
  if (params.date_after) urlParams.append("date_after", params.date_after);
  if (params.date_before) urlParams.append("date_before", params.date_before);
  if (params.ordering) {
    urlParams.append("ordering", params.ordering);
  }
  if (params.status) urlParams.append("status", params.status);
  if (params.labId) urlParams.append("lab", params.labId);
  const url = `${TESTS_ENDPOINT}?${urlParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<TestRecordInList>
  >(url, listFetcher, { keepPreviousData: true });

  return {
    testRecords: data?.results,
    totalCount: data?.count,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetches a single test record by its ID.
 */
export function useTestRecord(recordId: number | string | null) {
  const { data, error, isLoading, mutate } = useSWR<TestRecord>(
    recordId ? `${TESTS_ENDPOINT}${recordId}/` : null,
    singleFetcher
  );

  return {
    testRecord: data,
    isLoading,
    error,
    mutate,
  };
}

// ===============================================
// ==> MUTATION FUNCTIONS (CREATE, UPDATE, ACTIONS)
// ===============================================

/**
 * Creates a new test record.
 */
export const createTestRecord = async (
  data: TestRecordInput
): Promise<TestRecord> => {
  const response = await api.post(TESTS_ENDPOINT, data);
  return response.data;
};

/**
 * Updates the results for an existing test record.
 */
export const updateTestRecordResults = async (
  recordId: number,
  data: { results_input: TestResultInput[] }
): Promise<TestRecord> => {
  const response = await api.patch(`${TESTS_ENDPOINT}${recordId}/`, data);
  return response.data;
};

/**
 * Assigns a test to an analyst. (Supervisor/Manager action)
 */
export const assignTest = async (
  recordId: number,
  analystId: number
): Promise<TestRecord> => {
  const response = await api.patch(`${TESTS_ENDPOINT}${recordId}/assign/`, {
    analyst_id: analystId,
  });
  return response.data;
};

/**
 * Approves or rejects a test. (Supervisor/Manager action)
 */
export const approveOrRejectTest = async (
  recordId: number,
  payload: {
    status: "APPROVED" | "REJECTED";
    supervisor_comments?: string;
  }
): Promise<TestRecord> => {
  const response = await api.patch(
    `${TESTS_ENDPOINT}${recordId}/approve_reject/`,
    payload
  );
  return response.data;
};

/**
 * Orders a retest for a given record. (Supervisor/Manager action)
 */
export const orderRetest = async (
  recordId: number,
  analystIdToAssign: number
): Promise<TestRecord> => {
  const response = await api.post(
    `${TESTS_ENDPOINT}${recordId}/order_retest/`,
    {
      analyst_id: analystIdToAssign,
    }
  );
  return response.data; // This returns the *new* retest record
};

// ✅ NEW FUNCTION: Add this to the end of your file
/**
 * Closes an approved or rejected test record. (Supervisor/Manager action)
 */
export const closeTestRecord = async (
  recordId: number
): Promise<TestRecord> => {
  const response = await api.post(`${TESTS_ENDPOINT}${recordId}/close_record/`);
  return response.data;
};


// ✅ NEW FUNCTION: Add this to the end of your file
/**
 * Downloads the PDF report for a specific test record.
 */
export const downloadTestRecordPdf = async (
  recordId: number | string
): Promise<Blob> => {
  const response = await api.get(
    `${TESTS_ENDPOINT}${recordId}/download-pdf/`,
    {
      // This is the crucial part:
      // Tell axios to download the response as a file blob
      responseType: 'blob',
    }
  );
  // The response.data will be the PDF file itself
  return response.data;
};

/**
 * Downloads the Excel report for a specific test record.
 */
export const downloadTestRecordExcel = async (
  recordId: number | string
): Promise<Blob> => {
  const response = await api.get(
    `${TESTS_ENDPOINT}${recordId}/download-excel/`,
    {
      responseType: 'blob',
    }
  );
  return response.data;
};