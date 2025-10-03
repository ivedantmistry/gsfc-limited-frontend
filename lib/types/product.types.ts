// src/types/product.types.ts

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
 * Represents a product specification version for lists and forms.
 * Matches the VersionSerializer.
 */
export interface Version {
  id: number;
  product: number;
  product_name: string;
  version_name: string;
  description: string | null;
  status: "DRAFT" | "LOCKED";
  is_active: boolean;
  created_by_username: string;
   created_at: string | null;
  locked_at: string | null;
  activated_at: string | null;
}

/**
 * Represents a detailed, nested version for display inside a Product.
 * Matches the VersionNestedSerializer.
 */
export interface VersionNested
  extends Omit<Version, "product" | "product_name" | "created_by_username"> {
  parameters: ParameterDefinition[];
  grades: ProductGrade[];
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
  created_at: string;
  updated_at: string;
  active_version_name: string | null; 
}
