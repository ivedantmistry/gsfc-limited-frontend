// src/api/parameter.ts

import api from "@/lib/api";
import { ParameterDefinition } from "@/lib/types";

const PARAMETERS_ENDPOINT = "/inventory/parameters/";

// A base type for creating a parameter from the form data.
// The form provides enum_options as a single string.
type CreateParameterData = Omit<
  ParameterDefinition,
  "id" | "owner_info" | "enum_options"
> & {
  enum_options?: string;
};

// ✅ FIX: Omit the conflicting 'enum_options' from CreateParameterData
// before adding the correctly typed one for the final payload.
type CreateParameterPayload = Omit<CreateParameterData, "enum_options"> & {
  version_id?: number;
  grade_id?: number;
  enum_options?: string[] | null; // This is now the only definition
};

/**
 * Creates a new Parameter Definition directly on a Version.
 */
export const createParameterForVersion = async (
  versionId: number,
  parameterData: CreateParameterData
) => {
  const payload: CreateParameterPayload = {
    ...parameterData,
    version_id: versionId,
    enum_options: parameterData.enum_options
      ? parameterData.enum_options.split(",").map((s) => s.trim())
      : null,
  };
  const response = await api.post<ParameterDefinition>(
    PARAMETERS_ENDPOINT,
    payload
  );
  return response.data;
};

/**
 * Creates a new Parameter Definition on a Product Grade.
 */
export const createParameterForGrade = async (
  gradeId: number,
  parameterData: CreateParameterData
) => {
  const payload: CreateParameterPayload = {
    ...parameterData,
    grade_id: gradeId,
    enum_options: parameterData.enum_options
      ? parameterData.enum_options.split(",").map((s) => s.trim())
      : null,
  };
  const response = await api.post<ParameterDefinition>(
    PARAMETERS_ENDPOINT,
    payload
  );
  return response.data;
};
