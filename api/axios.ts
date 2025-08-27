"use client";
import axios from "axios";
import { getCookie, deleteCookie, setCookie } from "cookies-next";

export const api = axios.create({
  baseURL: "https://pxfbackend.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer`,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Log the actual API error for debugging
    console.error(
      "Axios interceptor - API Error Response:",
      error.response?.data
    );
    console.error("Axios interceptor - Status Code:", error.response?.status);

    // Check if this is a route that should handle auth errors locally
    const shouldHandleLocally =
      originalRequest.url.includes("/auth/user") ||
      originalRequest.url.includes("/chats/conversations") ||
      originalRequest.url.includes("/messages");

    // Skip token refresh for auth endpoints or if we're already checking token validity
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (originalRequest._retryCount || 0) < 3 &&
      !originalRequest.url.includes("/auth/sign-in") && // Skip for login endpoints
      !originalRequest.url.includes("/auth/signin") && // Also skip for signin endpoint
      !originalRequest.url.includes("/auth/verify-refresh-token") && // Skip for verification endpoint
      !shouldHandleLocally // Skip for routes that handle auth locally
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Check if the refresh token is valid
      const isValid = await isRefreshTokenValid();
      if (!isValid) {
        console.error("Refresh token invalid");
        deleteCookie("token");
        deleteCookie("refresh_token");

        // Only redirect if not handling locally and not already on signin page
        if (
          !shouldHandleLocally &&
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/sign-in")
        ) {
          window.location.href = "/sign-in";
        }
        return Promise.reject(error);
      }

      // Get the refresh token from cookies
      const refreshToken = getCookie("refresh_token");
      if (!refreshToken) {
        console.error("No refresh token available");

        // Only redirect if not handling locally and not already on signin page
        if (
          !shouldHandleLocally &&
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/sign-in")
        ) {
          window.location.href = "/sign-in";
        }
        return Promise.reject(error);
      }

      try {
        // Make a request to refresh the access token
        const response = await api.post("/auth/refresh-token", {
          refreshToken,
        });

        // Update tokens in cookies
        setCookie("token", response.data.accessToken);
        setCookie("refresh_token", response.data.refreshToken);

        // Update the Authorization header and retry the original request
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        // Handle token refresh failure
        console.error("Token refresh failed:", err);
        deleteCookie("token");
        deleteCookie("refresh_token");

        // Only redirect if not handling locally and not already on signin page
        if (
          !shouldHandleLocally &&
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/sign-in")
        ) {
          window.location.href = "/sign-in";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

const isRefreshTokenValid = async () => {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) return false;

  try {
    const response = await api.get("/auth/verify-refresh-token", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data.success;
  } catch (err) {
    console.error("Refresh token verification failed:", err);
    return false;
  }
};
