import { parseJwt } from "./parseJwt";

export const PERMISSIONS = {
  PROJECT_VIEW: "PROJECT_VIEW",
  PROJECT_CREATE: "PROJECT_CREATE",
  PROJECT_UPDATE: "PROJECT_UPDATE",
  PROJECT_DELETE: "PROJECT_DELETE",

  PROGRESS_VIEW: "PROGRESS_VIEW",
  PROGRESS_UPDATE: "PROGRESS_UPDATE",

  TASK_VIEW: "TASK_VIEW",
  TASK_CREATE: "TASK_CREATE",
  TASK_UPDATE: "TASK_UPDATE",
  TASK_DELETE: "TASK_DELETE",

  PAYMENT_VIEW: "PAYMENT_VIEW",
  PAYMENT_CREATE: "PAYMENT_CREATE",
  PAYMENT_APPROVE: "PAYMENT_APPROVE",
  FINANCE_MANAGE: "FINANCE_MANAGE",

  ESTIMATE_VIEW: "ESTIMATE_VIEW",
  ESTIMATE_CREATE: "ESTIMATE_CREATE",
  ESTIMATE_UPDATE: "ESTIMATE_UPDATE",
  ESTIMATE_APPROVE: "ESTIMATE_APPROVE",

  MATERIAL_VIEW: "MATERIAL_VIEW",
  MATERIAL_MANAGE: "MATERIAL_MANAGE",

  CUSTOMER_VIEW: "CUSTOMER_VIEW",
  CUSTOMER_MANAGE: "CUSTOMER_MANAGE",

  USER_VIEW: "USER_VIEW",
  USER_MANAGE: "USER_MANAGE",

  AUDIT_LOG_VIEW: "AUDIT_LOG_VIEW",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | string;

export const ROLES = {
  ADMIN: "ADMIN",
  DIRECTOR: "DIRECTOR",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  SITE_ENGINEER: "SITE_ENGINEER",
  ACCOUNTANT: "ACCOUNTANT",
  ESTIMATOR: "ESTIMATOR",
  WAREHOUSE: "WAREHOUSE",
  CUSTOMER_CARE: "CUSTOMER_CARE",
  CUSTOMER: "CUSTOMER",
  STAFF: "STAFF",
} as const;

const KNOWN_ROLES = new Set<string>(Object.values(ROLES));

export function extractAuthFromToken(): {
  roles: string[];
  permissions: string[];
  mustChangePassword: boolean;
} {
  if (typeof window === "undefined") {
    return { roles: [], permissions: [], mustChangePassword: false };
  }
  const token = localStorage.getItem("access_token");
  if (!token) {
    return { roles: [], permissions: [], mustChangePassword: false };
  }
  const payload = parseJwt(token);
  if (!payload) {
    return { roles: [], permissions: [], mustChangePassword: false };
  }

  const scopeRaw: string = typeof payload.scope === "string" ? payload.scope : "";
  const authorities = scopeRaw
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const roles: string[] = [];
  const permissions: string[] = [];

  for (const auth of authorities) {
    const normalized = auth.startsWith("SCOPE_") ? auth.slice(6) : auth;
    if (KNOWN_ROLES.has(normalized)) {
      roles.push(normalized);
    } else {
      permissions.push(normalized);
    }
  }

  return {
    roles,
    permissions,
    mustChangePassword: Boolean(payload.must_change_password),
  };
}

export function getStoredPermissions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("user_permissions");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback to token
  }
  return extractAuthFromToken().permissions;
}

export function getStoredRoles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("user_roles");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback to token
  }
  return extractAuthFromToken().roles;
}
