// lib/api.ts
import axios from "axios";
import { LoginResponse, User } from "./types";

// The base URL for your Django backend
const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;
/**
 * Constructs the full API URL for a given path.
 * @param path - The relative path for the API endpoint (e.g., 'inventory/products/').
 */
export const getFullApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "";
  // Ensure there are no double slashes
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// A flag to prevent multiple token refresh requests
let isRefreshing = false;
// A queue to hold requests while the token is being refreshed
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: Error | null) => void; // FIX 1: any -> Error | null
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  // FIX 2: any -> Error | null
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Adds the access token to every outgoing request
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

// Response Interceptor: Handles expired access tokens by refreshing them
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we are already refreshing the token, queue this request
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
        // No refresh token, logout the user (this will be handled by the AuthContext)
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        // Step 1: Get the new access token
        const refreshResponse = await axios.post<Pick<LoginResponse, "access">>(
          `${API_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // --- START OF THE FIX ---

        // Step 2: Fetch the latest user data with the new token
        const userResponse = await api.get<User>(`/auth/user/`);
        const updatedUser = userResponse.data;

        // Step 3: Update the user in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Step 4: Dispatch a custom event to notify the app of the change
        window.dispatchEvent(new Event("user-updated"));

        // --- END OF THE FIX ---

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        processQueue(refreshError as Error, null); // Cast refreshError to Error
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
