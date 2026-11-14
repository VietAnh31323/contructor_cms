import { useCallback, useEffect, useMemo, useState } from "react";
import {
  extractAuthFromToken,
  getStoredPermissions,
  getStoredRoles,
  PermissionCode,
  ROLES,
} from "@/helper/permissions";
import { useCurrentPermissionsQuery } from "@/service/constructor/Account/getPermissions";

export function usePermission() {
  const [mounted, setMounted] = useState(false);
  const [localPerms, setLocalPerms] = useState<string[]>([]);
  const [localRoles, setLocalRoles] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setLocalPerms(getStoredPermissions());
    setLocalRoles(getStoredRoles());
  }, []);

  const hasToken =
    mounted &&
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("access_token"));

  const { data: fetchedPerms, isLoading } = useCurrentPermissionsQuery(hasToken);

  useEffect(() => {
    if (Array.isArray(fetchedPerms) && typeof window !== "undefined") {
      localStorage.setItem("user_permissions", JSON.stringify(fetchedPerms));
      setLocalPerms(fetchedPerms);
    }
  }, [fetchedPerms]);

  const roles = useMemo(() => {
    if (!mounted) return [];
    if (localRoles.length > 0) return localRoles;
    return extractAuthFromToken().roles;
  }, [mounted, localRoles]);

  const permissions = useMemo(() => {
    if (!mounted) return [];
    const base = Array.isArray(fetchedPerms) ? fetchedPerms : localPerms;
    const fromToken = extractAuthFromToken().permissions;
    return Array.from(new Set([...base, ...fromToken]));
  }, [mounted, fetchedPerms, localPerms]);

  const isAdmin = useMemo(() => roles.includes(ROLES.ADMIN), [roles]);

  const hasPermission = useCallback(
    (required?: PermissionCode | PermissionCode[]): boolean => {
      if (!required) return true;
      if (!mounted) return false;
      if (isAdmin) return true;
      const list = Array.isArray(required) ? required : [required];
      if (list.length === 0) return true;
      return list.some((perm) => permissions.includes(perm));
    },
    [mounted, isAdmin, permissions]
  );

  const hasAllPermissions = useCallback(
    (required: PermissionCode[]): boolean => {
      if (!required || required.length === 0) return true;
      if (!mounted) return false;
      if (isAdmin) return true;
      return required.every((perm) => permissions.includes(perm));
    },
    [mounted, isAdmin, permissions]
  );

  const hasRole = useCallback(
    (required?: string | string[]): boolean => {
      if (!required) return true;
      if (!mounted) return false;
      const list = Array.isArray(required) ? required : [required];
      if (list.length === 0) return true;
      return list.some((r) => roles.includes(r));
    },
    [mounted, roles]
  );

  return {
    permissions,
    roles,
    isAdmin,
    isLoading,
    mounted,
    hasPermission,
    hasAllPermissions,
    hasRole,
  };
}
