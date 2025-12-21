import axios from "axios";

export const ConsApi = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "http://localhost:8078",
});
