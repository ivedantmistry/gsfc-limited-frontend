// src/api/parameter.ts

import api from "@/lib/api";
import { ParameterDefinition } from "@/lib/types";

const PARAMETERS_ENDPOINT = "/inventory/parameters/";

// This is the type for data used to CREATE a parameter.
type CreateParameterData = Omit<
  ParameterDefinition,
  "id" | "owner_info" | "enum_options"
> & {
  enum_options?: string;
};

// This is the (internal) type for the final JSON payload
type CreateParameterPayload = Omit<CreateParameterData, "enum_options"> & {
  version_id?: number;
  grade_id?: number;
  enum_options?: string[] | null;
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
/**
 * Updates an existing parameter definition.
 *
 * @param parameterId The ID of the parameter to update.
 * @param parameterData The data to update.
 */
export const updateParameter = async (
  parameterId: number,
  // ✅ FIX 1 (Line 70): Replaced 'any' with a partial type
  parameterData: Partial<CreateParameterData>
) => {
  // Destructure enum_options out from the rest of the data.
  const { enum_options, ...rest } = parameterData;

  // Create the payload from 'rest'. This is now type-safe.
  const payload: Partial<CreateParameterPayload> = { ...rest };

  // Process 'enum_options' separately and add it back
  // to the payload with the CORRECT type (string[]).
  if (typeof enum_options === "string") {
    payload.enum_options = enum_options
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
  }

  const response = await api.patch<ParameterDefinition>(
    `${PARAMETERS_ENDPOINT}${parameterId}/`,
    payload
  ); // ✅ FIX 2 (Line 83): Removed extra backticks ``
  return response.data;
};

/**
 * Deletes a parameter definition.
 *
 * @param parameterId The ID of the parameter to delete.
 */
export const deleteParameter = async (parameterId: number) => {
  await api.delete(`${PARAMETERS_ENDPOINT}${parameterId}/`);
};
