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
