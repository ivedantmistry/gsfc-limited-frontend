// src/api/parameter.ts

import api from "@/lib/api";
import { ParameterDefinition } from "@/lib/types";

const PARAMETERS_ENDPOINT = "/inventory/parameters/";

// A base type for creating a parameter, omitting fields the backend sets.
type CreateParameterData = Omit<
  ParameterDefinition,
  "id" | "owner_info" | "enum_options"
> & {
  enum_options?: string; // Form will provide a comma-separated string
};

// IMPORTANT: These ContentType IDs come from your backend's `django_content_type`
// database table. You will need to look them up once. They will not change.
// I am using placeholder values here.
const VERSION_CONTENT_TYPE_ID = 13; // Replace with your actual ID for the Version model
const GRADE_CONTENT_TYPE_ID = 14; // Replace with your actual ID for the ProductGrade model

/**
 * A helper function to create the final payload.
 */
const createParameterPayload = (
  parameterData: CreateParameterData,
  contentTypeId: number,
  objectId: number
) => {
  return {
    ...parameterData,
    content_type: contentTypeId,
    object_id: objectId,
    enum_options: parameterData.enum_options
      ? parameterData.enum_options.split(",").map((s) => s.trim())
      : null,
  };
};

/**
 * Creates a new Parameter Definition directly on a Version.
 */
export const createParameterForVersion = async (
  versionId: number,
  parameterData: CreateParameterData
) => {
  const payload = createParameterPayload(
    parameterData,
    VERSION_CONTENT_TYPE_ID,
    versionId
  );
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
  const payload = createParameterPayload(
    parameterData,
    GRADE_CONTENT_TYPE_ID,
    gradeId
  );
  const response = await api.post<ParameterDefinition>(
    PARAMETERS_ENDPOINT,
    payload
  );
  return response.data;
};