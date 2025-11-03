// lib/types/index.ts

// These types are from your other files and are correct
export * from "./product.types";
export * from "./test.types";
export * from "./lab.types";
export * from "./alert.types";
export * from "./stats.types"; 
export * from "./quality-detail.types"

// Represents the structure of a Group object.
export interface Group {
  name: string;
}

/**
 * Represents the data sent to the login endpoint.
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

// Represents the detailed user object returned from the backend.
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  groups: Group[];
  all_permissions: string[];
}

// Represents the successful response from the token endpoint.
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

// Represents a generic paginated API response.
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
