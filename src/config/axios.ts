import axios from "axios";

export const ConsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8078",
});

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_roles");
  localStorage.removeItem("user_permissions");
  localStorage.removeItem("must_change_password");
};

const PUBLIC_NO_AUTH_PATHS = [
  "/sign-in",
  "/sign-up",
  "/password/forgot",
  "/password/verify-otp",
];

const isPublicNoAuthUrl = (url?: string) => {
  if (!url) return false;
  if (url.startsWith("/public/") || url.includes("/public/")) {
    return true;
  }
  return PUBLIC_NO_AUTH_PATHS.some(
    (p) => url === p || url.startsWith(`${p}?`) || url.endsWith(p)
  );
};

ConsApi.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const url = config.url || "";

  // Không đính kèm access_token cũ vào các API đăng nhập / đăng ký / quên mật khẩu
  if (isPublicNoAuthUrl(url)) {
    if (config.headers) {
      delete config.headers.Authorization;
    }
    return config;
  }

  const access = localStorage.getItem("access_token");
  const otpToken = localStorage.getItem("otpToken");
  const otpScheme = localStorage.getItem("otpScheme");

  if (
    url.endsWith("/password/reset") ||
    url.endsWith("/account/password")
  ) {
    if (otpToken && otpScheme) {
      config.headers.Authorization = `${otpScheme} ${otpToken}`;
    }
  } else if (!config.headers?.Authorization && access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

ConsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error?.response?.status;
      const reqUrl = error?.config?.url || "";
      const errCode =
        error?.response?.data?.errors?.[0]?.code ||
        error?.response?.data?.code;

      if (
        status === 401 &&
        !reqUrl.includes("/sign-in") &&
        !reqUrl.includes("/api/v1/login") &&
        !reqUrl.includes("/public/") &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/landing")
      ) {
        clearAuthStorage();
        window.location.href = "/login";
      } else if (
        status === 403 &&
        errCode === "MUST_CHANGE_PASSWORD" &&
        !window.location.pathname.startsWith("/Dashboard/ForgotPass")
      ) {
        localStorage.setItem("must_change_password", "true");
        window.location.href = "/Dashboard/ForgotPass";
      }
    }
    return Promise.reject(error);
  }
);
