// src/routes.ts
export const MENU_URL = {
  DASHBOARD: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/",
};
export const ROUTES = {
  HOME: "/",
  LANDING: "/landing",
  LOGIN: "/login",
  RESET_PASSWORD: "/ressetPass",
  DASHBOARD: "/Dashboard",
  CATEGORY: "/Constructor/Category",
  EMPLOYEE: "/Constructor/Employee",
  INFORMATION: "/Dashboard/Information",
  FORGOTPASS: "/Dashboard/ForgotPass",
  ACCOUNT: "/Constructor/Account",
  AUDIT_LOG: "/Constructor/AuditLog",
  CUSTOMER: "/Constructor/Customer",
  PROGRESS_PROJECT: "/Constructor/Progress/ProgressProject",
  PROGRESS_PROJECT_ADD: "/Constructor/Progress/ProgressProject/addNew",
  PROGRESS_MANAGE: "/Constructor/Progress/ProgressManage",
  PROJECT: "/Constructor/Project",
  STEELSTATISTICS: "/Constructor/steelStatistics",
  STEELSTATISTICSNEW: "/Constructor/steelStatistics/addNew",
};
