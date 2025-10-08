// src/api/grade.ts

import api from "@/lib/api";
import { ProductGrade } from "@/lib/types";

const GRADES_ENDPOINT = "/inventory/grades/";

type CreateGradeData = {
  name: string;
  description?: string;
};

/**
 * Creates a new Product Grade and associates it with a version.
 */
export const createGrade = async (
  versionId: number,
  gradeData: CreateGradeData
) => {
  const payload = {
    ...gradeData,
    version: versionId, // Link to the version, not the product
  };
  const response = await api.post<ProductGrade>(GRADES_ENDPOINT, payload);
  return response.data;
};

/**
 * ✅ ADD THIS FUNCTION: Updates an existing product grade.
 * @param gradeId The ID of the grade to update.
 * @param data The new name and/or description for the grade.
 */
export const updateGrade = async (
  gradeId: number,
  data: { name?: string; description?: string }
) => {
  const response = await api.patch<ProductGrade>(`${GRADES_ENDPOINT}${gradeId}/`, data);
  return response.data;
};

/**
 * ✅ ADD THIS FUNCTION: Deletes a product grade.
 * @param gradeId The ID of the grade to delete.
 */
export const deleteGrade = async (gradeId: number) => {
  await api.delete(`${GRADES_ENDPOINT}${gradeId}/`);
};