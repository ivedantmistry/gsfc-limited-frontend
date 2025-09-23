/**
 * Represents a Product Grade object.
 * Based on inventory.models.ProductGrade and ProductGradeSerializer.
 */
export interface ProductGrade {
  id: number;
  name: string;
  description: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

/**
 * Represents a Product object, which can contain its associated grades.
 * Based on inventory.models.Product and ProductSerializer.
 */
export interface Product {
  id: number;
  name: string;
  product_id: string;
  description: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  grades: ProductGrade[]; // A product can have an array of its grades
}
