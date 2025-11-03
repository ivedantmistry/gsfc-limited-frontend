// src/lib/types/version.types.ts
import { ParameterDefinition, ProductGrade } from "./product.types";

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