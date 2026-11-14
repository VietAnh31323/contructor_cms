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

ConsApi.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const access = localStorage.getItem("access_token");
  const otpToken = localStorage.getItem("otpToken");
  const otpScheme = localStorage.getItem("otpScheme");

  if (config.url?.endsWith("/account/password")) {
    if (otpToken && otpScheme) {
      config.headers.Authorization = `${otpScheme} ${otpToken}`;
    }
  } else if (access) {
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
        !reqUrl.includes("/api/v1/login") &&
        !window.location.pathname.startsWith("/login")
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
