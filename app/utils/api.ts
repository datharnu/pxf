// // utils/api.ts - API utilities and constants

// import {
//   CreateEventResponse,
//   ApiErrorResponse,
//   GuestLimitOptions,
//   PhotoCapLimitOptions,
// } from "../../types/event";
// import { api } from "../../api/axios";
// import { getAccessToken } from "./auth";

// export const API_BASE_URL = "https://pxfbackend.onrender.com/api/v1";

// export const GUEST_LIMIT_OPTIONS: GuestLimitOptions[] = [
//   "10",
//   "100",
//   "250",
//   "500",
//   "800",
//   "1000+",
// ];
// export const PHOTO_CAP_LIMIT_OPTIONS: PhotoCapLimitOptions[] = [
//   "5",
//   "10",
//   "15",
//   "20",
//   "25",
// ];

// // Price mapping for display purposes
// export const PRICE_MAP: Record<GuestLimitOptions, string> = {
//   "10": "FREE",
//   "100": "₦5,000",
//   "250": "₦10,000",
//   "500": "₦15,000",
//   "800": "₦25,000",
//   "1000+": "₦30,000",
// };

// export interface CreateEventPayload {
//   title: string;
//   description: string;
//   eventFlyer?: string;
//   guestLimit: GuestLimitOptions;
//   photoCapLimit: PhotoCapLimitOptions;
//   eventDate: string;
//   isPasswordProtected: boolean;
//   customPassword?: string;
// }

// export class ApiError extends Error {
//   constructor(
//     message: string,
//     public statusCode: number,
//     public errors?: Record<string, string[]>
//   ) {
//     super(message);
//     this.name = "ApiError";
//   }
// }

// export const createEvent = async (
//   payload: CreateEventPayload
// ): Promise<CreateEventResponse> => {
//   try {
//     // Ensure we have an access token
//     const token = getAccessToken();
//     if (!token) {
//       throw new ApiError("Authentication required. Please sign in.", 401);
//     }

//     const response = await api.post("/events", payload);
//     return response.data as CreateEventResponse;
//   } catch (error: unknown) {
//     if (error && typeof error === "object" && "response" in error) {
//       const axiosError = error as {
//         response: { data: ApiErrorResponse; status: number };
//       };
//       const errorData = axiosError.response.data as ApiErrorResponse;
//       throw new ApiError(
//         errorData.message || "Failed to create event",
//         axiosError.response.status,
//         errorData.errors
//       );
//     }

//     // Handle network errors or other unexpected errors
//     throw new ApiError("Network error: Unable to create event", 0);
//   }
// };

// // Utility function to format date for datetime-local input
// export const formatDateForInput = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");

//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// };

// // Utility function to validate URL
// export const isValidUrl = (string: string): boolean => {
//   try {
//     new URL(string);
//     return true;
//   } catch {
//     return false;
//   }
// };

// // Utility function to validate date
// export const isValidFutureDate = (dateString: string): boolean => {
//   const inputDate = new Date(dateString);
//   const now = new Date();
//   return !isNaN(inputDate.getTime()) && inputDate > now;
// };

// // Generic authenticated API function
// export const authenticatedApiCall = async <T>(
//   endpoint: string,
//   options: {
//     method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
//     data?: unknown;
//     params?: Record<string, string>;
//   } = {}
// ): Promise<T> => {
//   const { method = "GET", data, params } = options;

//   try {
//     const config: Record<string, unknown> = {
//       method,
//       url: endpoint,
//     };

//     if (data) {
//       config.data = data;
//     }

//     if (params) {
//       config.params = params;
//     }

//     const response = await api(config);
//     return response.data as T;
//   } catch (error: unknown) {
//     if (error && typeof error === "object" && "response" in error) {
//       const axiosError = error as {
//         response: { data: ApiErrorResponse; status: number };
//       };
//       const errorData = axiosError.response.data as ApiErrorResponse;
//       throw new ApiError(
//         errorData.message || "API request failed",
//         axiosError.response.status,
//         errorData.errors
//       );
//     }

//     throw new ApiError("Network error: Unable to complete request", 0);
//   }
// };

// // Example usage functions for other endpoints
// export const getUserEvents = async () => {
//   console.log("Calling getUserEvents API...");
//   const result = await authenticatedApiCall<{
//     success: boolean;
//     message: string;
//     events: CreateEventResponse[];
//     pagination: {
//       page: number;
//       limit: number;
//       total: number;
//       totalPages: number;
//     };
//   }>("/events/user/my-events");

//   console.log("getUserEvents API result:", result);
//   console.log("Result type:", typeof result);
//   console.log("Is Array?", Array.isArray(result));
//   console.log("Result keys:", result ? Object.keys(result) : "null/undefined");

//   // Handle the actual API response structure
//   if (
//     result &&
//     typeof result === "object" &&
//     "events" in result &&
//     Array.isArray(result.events)
//   ) {
//     console.log("Found events property, returning result.events");
//     return result.events;
//   }

//   console.log("No valid events array found, returning empty array");
//   return [];
// };

// export const getEventById = async (eventId: string) => {
//   return authenticatedApiCall<CreateEventResponse>(`/events/${eventId}`);
// };

// export const updateEvent = async (
//   eventId: string,
//   payload: Partial<CreateEventPayload>
// ) => {
//   return authenticatedApiCall<CreateEventResponse>(`/events/${eventId}`, {
//     method: "PUT",
//     data: payload,
//   });
// };

// export const deleteEvent = async (eventId: string) => {
//   return authenticatedApiCall<{ success: boolean }>(`/events/${eventId}`, {
//     method: "DELETE",
//   });
// };

// utils/api.ts - API utilities and constants

import {
  CreateEventResponse,
  ApiErrorResponse,
  GuestLimitOptions,
  PhotoCapLimitOptions,
  EventResponse,
} from "../../types/event";
import { api } from "../../api/axios";
import { getAccessToken } from "./auth";

export const API_BASE_URL = "https://pxfbackend.onrender.com/api/v1";

export const GUEST_LIMIT_OPTIONS: GuestLimitOptions[] = [
  "10",
  "100",
  "250",
  "500",
  "800",
  "1000+",
  // Allow custom selection in UI/validation; backend enforces rules
  // @ts-expect-error extend at runtime for UI logic
  "CUSTOM",
];
export const PHOTO_CAP_LIMIT_OPTIONS: PhotoCapLimitOptions[] = [
  "5",
  "10",
  "15",
  "20",
  "25",
  // Allow custom selection in UI/validation; backend enforces rules
  // @ts-expect-error extend at runtime for UI logic
  "CUSTOM",
];

// Price mapping for display purposes
export const PRICE_MAP: Record<GuestLimitOptions, string> = {
  "10": "FREE",
  "100": "₦7,000",
  "250": "₦12,000",
  "500": "₦18,000",
  "800": "₦23,000",
  "1000+": "₦28,000",
};

export interface CreateEventPayload {
  title: string;
  description: string;
  eventFlyer?: string;
  guestLimit: GuestLimitOptions;
  photoCapLimit: PhotoCapLimitOptions;
  eventDate: string;
  isPasswordProtected: boolean;
  customPassword?: string;
  // Included for CUSTOM guest plans; ignored otherwise
  customGuestLimit?: number;
  // Included for CUSTOM photo cap plans; ignored otherwise
  customPhotoCapLimit?: number;
}

// Separate interface for update payload (only fields that can be updated)
export interface UpdateEventPayload {
  title: string;
  description: string;
  eventFlyer?: string;
  guestLimit: GuestLimitOptions;
  photoCapLimit: PhotoCapLimitOptions;
  eventDate: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const createEvent = async (
  payload: CreateEventPayload
): Promise<CreateEventResponse> => {
  try {
    // Ensure we have an access token
    const token = getAccessToken();
    if (!token) {
      throw new ApiError("Authentication required. Please sign in.", 401);
    }

    const response = await api.post("/events", payload);
    return response.data as CreateEventResponse;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: { data: ApiErrorResponse; status: number };
      };
      const errorData = axiosError.response.data as ApiErrorResponse;
      throw new ApiError(
        errorData.message || "Failed to create event",
        axiosError.response.status,
        errorData.errors
      );
    }

    // Handle network errors or other unexpected errors
    throw new ApiError("Network error: Unable to create event", 0);
  }
};

// Update the updateEvent function to use the specific payload
export const updateEvent = async (
  eventId: string,
  payload: UpdateEventPayload
): Promise<CreateEventResponse> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new ApiError("Authentication required. Please sign in.", 401);
    }

    const response = await api.put(`/events/${eventId}`, payload);
    return response.data as CreateEventResponse;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: { data: ApiErrorResponse; status: number };
      };
      const errorData = axiosError.response.data as ApiErrorResponse;
      throw new ApiError(
        errorData.message || "Failed to update event",
        axiosError.response.status,
        errorData.errors
      );
    }

    throw new ApiError("Network error: Unable to update event", 0);
  }
};

// Utility function to format date for datetime-local input
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Utility function to validate URL
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// Utility function to validate date
export const isValidFutureDate = (dateString: string): boolean => {
  const inputDate = new Date(dateString);
  if (isNaN(inputDate.getTime())) return false;

  // Compare by calendar day (local), allowing today
  const inputDay = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return inputDay.getTime() >= today.getTime();
};

// Generic authenticated API function
export const authenticatedApiCall = async <T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    data?: unknown;
    params?: Record<string, string>;
  } = {}
): Promise<T> => {
  const { method = "GET", data, params } = options;

  try {
    const config: Record<string, unknown> = {
      method,
      url: endpoint,
    };

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    const response = await api(config);
    return response.data as T;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: { data: ApiErrorResponse; status: number };
      };
      const errorData = axiosError.response.data as ApiErrorResponse;
      throw new ApiError(
        errorData.message || "API request failed",
        axiosError.response.status,
        errorData.errors
      );
    }

    throw new ApiError("Network error: Unable to complete request", 0);
  }
};

// Example usage functions for other endpoints
export const getUserEvents = async () => {
  console.log("Calling getUserEvents API...");
  const result = await authenticatedApiCall<{
    success: boolean;
    message: string;
    events: CreateEventResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>("/events/user/my-events");

  console.log("getUserEvents API result:", result);
  console.log("Result type:", typeof result);
  console.log("Is Array?", Array.isArray(result));
  console.log("Result keys:", result ? Object.keys(result) : "null/undefined");

  // Handle the actual API response structure
  if (
    result &&
    typeof result === "object" &&
    "events" in result &&
    Array.isArray(result.events)
  ) {
    console.log("Found events property, returning result.events");
    return result.events;
  }

  console.log("No valid events array found, returning empty array");
  return [];
};

export const getEventById = async (eventId: string) => {
  return authenticatedApiCall<EventResponse>(`/events/${eventId}`);
};

export const deleteEvent = async (eventId: string) => {
  return authenticatedApiCall<{ success: boolean }>(`/events/${eventId}`, {
    method: "DELETE",
  });
};

// Payments
export interface InitPaymentResponse {
  success: boolean;
  message: string;
  authorizationUrl: string;
  reference: string;
}

export const initPayment = async (data: {
  eventId: string;
  guestLimit: string;
  photoCapLimit: string;
  email: string;
}): Promise<InitPaymentResponse> => {
  return authenticatedApiCall<InitPaymentResponse>("/payments/init", {
    method: "POST",
    data,
  });
};

// export const initCustomPayment = async (data: {
//   eventId: string;
//   email: string;
// }): Promise<InitPaymentResponse> => {
//   return authenticatedApiCall<InitPaymentResponse>("/payments/init-custom", {
//     method: "POST",
//     data,
//   });
// };

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  status: "PAID" | "PENDING" | "FAILED";
  reference: string;
}

export const verifyPayment = async (
  reference: string
): Promise<VerifyPaymentResponse> => {
  return authenticatedApiCall<VerifyPaymentResponse>(
    `/payments/verify/${reference}`
  );
};

// Custom payment initialization
export interface InitCustomPaymentResponse {
  success: boolean;
  authorizationUrl: string;
  reference: string;
}

export const initCustomPayment = async (data: {
  eventId: string;
  email: string;
}): Promise<InitCustomPaymentResponse> => {
  return authenticatedApiCall<InitCustomPaymentResponse>(
    "/payments/init-custom",
    {
      method: "POST",
      data,
    }
  );
};

// Pre-create payment flow (pay first, then create)
export interface InitPrecreatePaymentResponse {
  success: boolean;
  authorizationUrl: string;
  reference: string;
}

export const initPrecreatePayment = async (payload: {
  title: string;
  description: string;
  eventFlyer?: string;
  guestLimit: string;
  photoCapLimit: string;
  customGuestLimit?: number;
  customPhotoCapLimit?: number;
  eventDate?: string;
  isPasswordProtected: boolean;
  customPassword?: string;
  email: string;
}): Promise<InitPrecreatePaymentResponse> => {
  return authenticatedApiCall<InitPrecreatePaymentResponse>(
    "/payments/init-precreate",
    {
      method: "POST",
      data: payload,
    }
  );
};

export interface VerifyPrecreatePaymentResponse {
  success: boolean;
  message: string;
  event?: {
    id?: string;
    title?: string;
    description?: string;
    eventDate?: string | null;
    eventSlug?: string;
    isPasswordProtected?: boolean;
    guestLimit?: string;
    photoCapLimit?: string;
    eventFlyer?: string | null;
  };
  accessInfo?: {
    qrCodeData?: string;
    generatedPassword?: string | null;
  };
}

export const verifyPrecreatePayment = async (
  reference: string
): Promise<VerifyPrecreatePaymentResponse> => {
  return authenticatedApiCall<VerifyPrecreatePaymentResponse>(
    `/payments/verify-precreate/${encodeURIComponent(reference)}`
  );
};
