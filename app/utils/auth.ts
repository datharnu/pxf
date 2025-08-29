// utils/auth.ts - Authentication utilities

import { getCookie, deleteCookie } from "cookies-next";
import { useAccessTokenStore } from "../../store/userStore";

// Get access token from multiple sources
export const getAccessToken = (): string | null => {
  // Try to get from cookies first (axios interceptor uses this)
  const cookieToken = getCookie("token") as string;
  if (cookieToken) return cookieToken;

  // Try to get from localStorage
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("accessToken");
    if (localToken) return localToken;
  }

  // Try to get from Zustand store
  const storeToken = useAccessTokenStore.getState().getAccessToken();
  if (storeToken) return storeToken;

  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

// Clear all authentication data
export const clearAuthData = (): void => {
  // Clear cookies
  deleteCookie("token");
  deleteCookie("refresh_token");

  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // Clear Zustand store
  useAccessTokenStore.getState().clearAccessToken();
};

// Get authorization header for API requests
export const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("No access token available");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

