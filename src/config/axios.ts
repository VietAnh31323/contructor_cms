import axios from "axios";
import queryString from "query-string";
export const ConsApi = axios.create({
  baseURL: "http://localhost:8078",
});

ConsApi.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");

  const otpToken = localStorage.getItem("otpToken");
  const otpScheme = localStorage.getItem("otpScheme");

  if (config.url?.includes("/password")) {
    if (otpToken && otpScheme) {
      config.headers.Authorization = `${otpScheme} ${otpToken}`;
    }
  } else if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});
export const requestAuth = axios.create({
  timeout: 26405,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params: any) =>
      queryString.stringify(params, {
        arrayFormat: "comma",
        skipNull: true,
        skipEmptyString: true,
      }),
  },
});
