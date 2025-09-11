// utils/admin.ts - Admin API utilities

import { api } from "@/api/axios";
import { getAccessToken } from "./auth";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface AdminStats {
  success: boolean;
  data: {
    totals: {
      users: number;
      events: number;
      media: number;
    };
    last7Days: {
      users: number;
      events: number;
      media: number;
    };
    payments: {
      paid: number;
      pending: number;
      free: number;
      totalRevenue: number;
    };
  };
}

export interface AdminUser {
  id: string;
  fullname: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    fullname: string;
    email: string;
  };
  eventFlyer?: string;
  eventSlug: string;
  guestLimit: string;
  photoCapLimit: string;
  isPasswordProtected: boolean;
  accessPassword?: string;
  paymentStatus: string;
  planPrice: number;
  paidAt?: string;
  paystackReference?: string;
  qrCodeData: string;
  customGuestLimit?: number;
  customPhotoCapLimit?: number;
}

export interface AdminMedia {
  id: string;
  eventId: string;
  filename: string;
  originalName?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    title: string;
    eventSlug: string;
  };
  uploader?: {
    id: string;
    fullname: string;
    email: string;
  };
}

export interface AdminPayment {
  id: string;
  eventId: string;
  userId: string;
  amount?: number;
  currency?: string;
  status?: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paystackReference?: string;
  paystackTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  event?: {
    id: string;
    title: string;
    eventSlug: string;
  };
  user?: {
    id: string;
    fullname: string;
    email: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminSignupPayload {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminKey: string;
}

export interface AdminSignupResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    fullname: string;
    email: string;
    role: string;
  };
}

// Check if user has admin privileges
export const isAdminUser = (): boolean => {
  try {
    const token = getAccessToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "admin" || payload.role === "superadmin";
  } catch (error) {
    console.error("Error checking admin privileges:", error);
    return false;
  }
};

// Get user role from token
export const getUserRole = (): string | null => {
  try {
    const token = getAccessToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

// Admin signup endpoint
export const adminSignup = async (
  payload: AdminSignupPayload
): Promise<AdminSignupResponse> => {
  try {
    const response = await api.post("/auth/admin-signup", payload);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to create admin user";
    throw new Error(errorMessage);
  }
};

// Get admin statistics
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to fetch admin statistics";
    throw new Error(errorMessage);
  }
};

// Get all users with pagination
export const getAdminUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<AdminUser>> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to fetch users";
    throw new Error(errorMessage);
  }
};

// Toggle user active status
export const toggleUserStatus = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const response = await api.patch(`/admin/users/${userId}/toggle`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to update user status";
    throw new Error(errorMessage);
  }
};

// Get all events with pagination
export const getAdminEvents = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<AdminEvent>> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const response = await api.get(`/admin/events?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to fetch events";
    throw new Error(errorMessage);
  }
};

// Toggle event active status
export const toggleEventStatus = async (
  eventId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const response = await api.patch(`/admin/events/${eventId}/toggle`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to update event status";
    throw new Error(errorMessage);
  }
};

// Get all media with pagination and filtering
export const getAdminMedia = async (
  page: number = 1,
  limit: number = 10,
  mediaType?: "image" | "video"
): Promise<PaginatedResponse<AdminMedia>> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (mediaType) {
      params.append("type", mediaType);
    }

    const response = await api.get(`/admin/media?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to fetch media";
    throw new Error(errorMessage);
  }
};

// Moderate media (approve/reject/delete)
export const moderateMedia = async (
  mediaId: string,
  action: "approve" | "reject" | "delete"
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const response = await api.patch(`/admin/media/${mediaId}/moderate`, {
      action,
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to moderate media";
    throw new Error(errorMessage);
  }
};

// Payment management functions
export const getAdminPayments = async (
  page: number = 1,
  limit: number = 10,
  status?: "pending" | "paid" | "failed" | "refunded"
): Promise<PaginatedResponse<AdminPayment>> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    if (!isAdminUser()) {
      throw new Error("Admin privileges required");
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    const response = await api.get(`/admin/payments?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as ApiError).response?.data?.message
        : "Failed to fetch payments";
    throw new Error(errorMessage);
  }
};

// Utility function to format date for display
export const formatAdminDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Utility function to get role badge styling
export const getRoleBadgeStyle = (role: string): string => {
  switch (role) {
    case "superadmin":
      return "bg-red-100 text-red-800";
    case "admin":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Utility function to get status badge styling
export const getStatusBadgeStyle = (isActive: boolean): string => {
  return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Utility function to get media type badge styling
export const getMediaTypeBadgeStyle = (fileType: string): string => {
  if (!fileType) return "bg-gray-100 text-gray-800";

  if (fileType.startsWith("image/")) {
    return "bg-blue-100 text-blue-800";
  } else if (fileType.startsWith("video/")) {
    return "bg-purple-100 text-purple-800";
  } else {
    return "bg-gray-100 text-gray-800";
  }
};

// Utility function to get media type icon
export const getMediaTypeIcon = (fileType: string): string => {
  if (!fileType) return "📄";

  if (fileType.startsWith("image/")) {
    return "🖼️";
  } else if (fileType.startsWith("video/")) {
    return "🎥";
  } else {
    return "📄";
  }
};

// Payment utility functions
export const formatCurrency = (amount?: number, currency?: string): string => {
  if (amount === undefined || amount === null) return "₦0.00";

  const currencyCode = currency || "NGN";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

export const getPaymentStatusBadgeStyle = (status?: string): string => {
  if (!status) return "bg-gray-100 text-gray-800";

  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPaymentMethodIcon = (method?: string): string => {
  if (!method) return "💰";

  switch (method.toLowerCase()) {
    case "card":
    case "credit_card":
    case "debit_card":
      return "💳";
    case "bank_transfer":
    case "bank":
      return "🏦";
    case "paystack":
      return "🔗";
    case "cash":
      return "💵";
    default:
      return "💰";
  }
};

// Admin route protection hook
export const useAdminRoute = () => {
  const checkAdminAccess = (): boolean => {
    if (typeof window === "undefined") return false;

    const token = getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "admin" || payload.role === "superadmin";
    } catch (error) {
      console.error("Error checking admin access:", error);
      return false;
    }
  };

  return { checkAdminAccess, isAdminUser: isAdminUser() };
};
