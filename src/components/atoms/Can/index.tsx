import React, { ReactNode } from "react";
import { PermissionCode } from "@/helper/permissions";
import { usePermission } from "@/components/hooks/permission/usePermission";

type CanProps = {
  permission?: PermissionCode | PermissionCode[];
  role?: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export const Can: React.FC<CanProps> = ({
  permission,
  role,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAllPermissions, hasRole } = usePermission();

  const permAllowed = permission
    ? requireAll && Array.isArray(permission)
      ? hasAllPermissions(permission)
      : hasPermission(permission)
    : true;

  const roleAllowed = role ? hasRole(role) : true;

  if (!permAllowed || !roleAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Can;
