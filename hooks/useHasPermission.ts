import { useAuth } from "./useAuth";

/**
 * Custom hook to check if the current user has a specific permission.
 * @param requiredPermission The full permission codename to check for (e.g., "inventory.can_view_products").
 * @returns `true` if the user has the permission, otherwise `false`.
 */
export const useHasPermission = (requiredPermission: string): boolean => {
  const { user } = useAuth();

  // **THE FIX IS HERE**
  // 1. Check for the correct property: `user.all_permissions`.
  // 2. Check that it's an array.
  // 3. Directly check if the requiredPermission string exists in the array.
  if (!user || !user.all_permissions || !Array.isArray(user.all_permissions)) {
    return false;
  }

  return user.all_permissions.includes(requiredPermission);
};