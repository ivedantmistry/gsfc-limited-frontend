// lib/types/index.ts

/**
 * Represents the structure of a Permission object.
 * Based on authentication.serializers.PermissionSerializer
 */
export interface Permission {
  id: number;
  name: string;
  codename: string; // e.g., "view_user_list"
}

/**
 * Represents the structure of a Group object.
 * Based on authentication.serializers.GroupSerializer
 */
export interface Group {
  name: string;
}

/**
 * Represents the detailed user object returned from the backend.
 * Based on authentication.serializers.UserDetailSerializer
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string; // ISO 8601 date string
  last_login: string | null; // Can be null
  groups: Group[];
  all_permissions: string[];
}

/**
 * Represents the successful response from the token endpoint.
 * Based on authentication.serializers.CustomTokenObtainPairSerializer
 */
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
