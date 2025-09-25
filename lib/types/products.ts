/**
 * Represents a Product Grade object.
 */
export interface ProductGrade {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Product object.
 */
export interface Product {
  id: number;
  name: string;
  product_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  grades: ProductGrade[];
}

/**
 * Represents a Parameter Definition object.
 * Based on inventory.models.ParameterDefinition.
 */
export interface ParameterDefinition {
  id: number;
  name: string;
  unit: string | null;
  min_value: string | null;
  max_value: string | null;
  data_type: "INTEGER" | "DECIMAL" | "STRING" | "BOOLEAN" | "ENUM";
  product: number | null;
  product_grade: number | null;
  enum_options: string[] | null;
  boolean_true_label: string | null;
  boolean_false_label: string | null;
}
