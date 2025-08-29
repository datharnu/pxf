/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../api/axios";

// Types
export interface EventData {
  id: string;
  title: string;
  description: string;
  eventFlyer?: string;
  guestLimit: string;
  photoCapLimit: string;
  isPasswordProtected: boolean;
  eventDate: string;
  eventSlug: string;
  creator: {
    id: string;
    fullname: string;
    email: string;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  event?: T;
  requiresPassword?: boolean;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Single function to handle event access - matches backend getEventBySlug
export const getEventAccess = async (
  slug: string,
  password?: string
): Promise<ApiResponse<EventData>> => {
  try {
    console.log(`🚀 Getting event access for slug: ${slug}`, {
      hasPassword: !!password,
    });

    // This matches your backend: POST /events/access/:slug
    const response = await api.post(`/events/access/${slug}`, {
      // Only include password if provided
      ...(password && { password }),
    });

    console.log("✅ Event access response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Event access error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle 401 Unauthorized (password required)
    if (error.response?.status === 401) {
      return {
        success: false,
        requiresPassword: true,
        message: error.response.data?.message || "Password required",
      };
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      throw new ApiError("Event not found or inactive");
    }

    // Handle 400 Bad Request (invalid password)
    if (error.response?.status === 400) {
      return {
        success: false,
        requiresPassword: true,
        message: error.response.data?.message || "Invalid password",
      };
    }

    throw new ApiError(
      error.response?.data?.message || "Failed to access event"
    );
  }
};

// Optional: Separate password verification (matches backend verifyEventAccess)
export const verifyEventPassword = async (
  slug: string,
  password: string
): Promise<ApiResponse> => {
  try {
    console.log(`🔑 Verifying password for slug: ${slug}`);

    // This matches your backend: POST /events/verify/:slug
    const response = await api.post(`/events/verify/${slug}`, { password });

    console.log("✅ Password verification response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Password verification error:", error.response?.data);

    // Return the error response data if available
    if (error.response?.data) {
      return error.response.data;
    }

    throw new ApiError(
      error.response?.data?.message || "Password verification failed"
    );
  }
};

// Main function to handle the complete flow
export const processEventAccess = async (
  slug: string,
  password?: string
): Promise<{
  success: boolean;
  needsPassword: boolean;
  event?: EventData;
  message?: string;
}> => {
  try {
    console.log("🚀 Processing event access:", {
      slug,
      hasPassword: !!password,
    });

    // Make a single call to get event access
    const result = await getEventAccess(slug, password);

    if (result.success && result.event) {
      console.log("✅ Event access successful");
      return {
        success: true,
        needsPassword: false,
        event: result.event,
      };
    }

    // If requiresPassword is true, we need a password
    if (result.requiresPassword) {
      console.log("🔐 Password required");
      return {
        success: false,
        needsPassword: true,
        message: result.message || "Password required",
      };
    }

    console.log("❌ Event access failed");
    return {
      success: false,
      needsPassword: false,
      message: result.message || "Failed to access event",
    };
  } catch (error: any) {
    console.error("💥 Process Event Access Error:", error);
    return {
      success: false,
      needsPassword: false,
      message: error.message || "An error occurred while accessing the event",
    };
  }
};
