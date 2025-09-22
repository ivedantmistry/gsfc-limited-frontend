// hooks/useHasPermission.ts
import { useAuth } from "./useAuth";

/**
 * Custom hook to check if the current user has a specific permission.
 * @param requiredPermission The permission codename to check for (e.g., "authentication.view_user_list").
 * @returns `true` if the user has the permission, otherwise `false`.
 */
export const useHasPermission = (requiredPermission: string): boolean => {
  const { user } = useAuth();

  if (!user || !user.user_permissions) {
    return false;
  }

  // Check if any of the user's permissions match the required one
  return user.user_permissions.some(
    (permission) => permission.codename === requiredPermission
  );
};