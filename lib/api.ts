// lib/api.ts
import axios from "axios";
import { LoginResponse, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "";

/**
 * Constructs the full API URL for a given path.
 * @param path - The relative path for the API endpoint (e.g., 'inventory/products').
 */
export const getFullApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\/|\/$/g, "")}`;
};

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ""), // Ensure no trailing slash on base URL
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: Error | null) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url || "";

    // Normalize URL for comparison (remove trailing slashes)
    const cleanUrl = url.replace(/\/$/, "");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      cleanUrl !== "/auth/token" &&
      cleanUrl !== "/auth/token/refresh"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const refreshEndpoint = `${API_URL.replace(/\/$/, "")}/auth/token/refresh`;
        const refreshResponse = await axios.post<Pick<LoginResponse, "access">>(
          refreshEndpoint,
          { refresh: refreshToken }
        );

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        const userResponse = await api.get<User>(`/auth/user`);
        const updatedUser = userResponse.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("user-updated"));

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        processQueue(refreshError as Error, null);
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
