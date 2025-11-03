// src/lib/types/product.types.ts
import { VersionNested } from "./version.types";

/**
 * Represents the owner of a parameter, which can be a Version or a ProductGrade.
 * Matches the 'owner_info' field from ParameterDefinitionSerializer.
 */
export interface OwnerInfo {
  owner_type: "Version" | "ProductGrade";
  product: string;
  version_name: string;
  grade_name?: string; // Optional, only present for ProductGrade
}

/**
 * Represents a single testable parameter.
 * Matches the ParameterDefinitionSerializer.
 */
export interface ParameterDefinition {
  id: number;
  owner_info: OwnerInfo | null;
  name: string;
  description: string | null;
  data_type: "INTEGER" | "DECIMAL" | "STRING" | "BOOLEAN" | "ENUM";
  unit: string | null;
  is_required: boolean;
  enum_options: string[] | null;
  min_value: string | null;
  max_value: string | null;
  boolean_true_label: string | null;
  boolean_false_label: string | null;
}

/**
 * Represents a quality grade for a product version.
 * Matches the ProductGradeSerializer.
 */
export interface ProductGrade {
  id: number;
  version: number;
  product_name: string;
  name: string;
  description: string | null;
  parameters: ParameterDefinition[];
}

/**
 * Represents the top-level Product.
 * Matches the ProductSerializer.
 */
export interface Product {
  id: number;
  name: string;
  product_id: string;
  description: string | null;
  versions: VersionNested[];
  created_at: string;
  updated_at: string;
  active_version_name: string | null;
  created_by_username: string;
}

export interface ProductListItem {
  id: number;
  product_id: string;
  name: string;
  created_at: string;
  active_version_name: string | null;
}