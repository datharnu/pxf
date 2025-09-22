/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from "@/api/axios";
import {
  FaceEnrollmentResponse,
  FaceProfileResponse,
  FaceStatsResponse,
  MyFacesResponse,
  FaceProcessingResponse,
  FaceMatchResult,
} from "@/types/face";

/**
 * Google Vision API Face Detection Service Functions
 * Handles all Google Vision API integration for face detection and identification
 */

/**
 * Enroll user's face for an event
 */
export const enrollUserFace = async (
  eventId: string,
  imageFile: File
): Promise<FaceEnrollmentResponse> => {
  try {
    console.log(
      "Enrolling face for event:",
      eventId,
      "using Google Vision API"
    );

    const formData = new FormData();
    formData.append("faceImage", imageFile);

    const response = await api.post(
      `/faces/events/${eventId}/enroll`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Face enrollment response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error enrolling face:", error);
    console.error("Error response:", error.response?.data);

    // Provide more specific error messages based on the backend response
    let errorMessage = "Failed to enroll face";

    if (error.response?.data?.error?.message) {
      // Handle nested error structure: { error: { message: "..." } }
      errorMessage = error.response.data.error.message;
    } else if (error.response?.data?.message) {
      // Handle direct message structure: { message: "..." }
      errorMessage = error.response.data.message;
    } else if (error.response?.status === 500) {
      errorMessage = "Server error during face enrollment. Please try again.";
    } else if (error.response?.status === 400) {
      errorMessage =
        "Invalid image for face enrollment. Please try a different photo.";
    } else if (error.response?.status === 403) {
      errorMessage =
        "Google Vision API access denied. Please check your API credentials.";
    }

    // Create error object that preserves the original error structure
    const enrollmentError = new Error(errorMessage);
    (enrollmentError as any).originalError = error;
    (enrollmentError as any).response = error.response;

    throw enrollmentError;
  }
};

/**
 * Get user's face profile for an event
 */
export const getUserFaceProfile = async (
  eventId: string
): Promise<FaceProfileResponse> => {
  try {
    const response = await api.get(`/faces/events/${eventId}/profile`);
    return response.data;
  } catch (error: any) {
    console.error("Error getting face profile:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get face profile"
    );
  }
};

/**
 * Delete user's face profile for an event
 */
export const deleteUserFaceProfile = async (
  eventId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/faces/events/${eventId}/profile`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting face profile:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete face profile"
    );
  }
};

/**
 * Get face detection statistics for an event (Admin/Event Creator only)
 */
export const getFaceStats = async (
  eventId: string
): Promise<FaceStatsResponse> => {
  try {
    const response = await api.get(`/faces/events/${eventId}/stats`);
    return response.data;
  } catch (error: any) {
    console.error("Error getting face stats:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get face statistics"
    );
  }
};

/**
 * Get media with user's face (My PXF)
 */
export const getMyFaces = async (
  eventId: string,
  similarityThreshold: number = 0.8
): Promise<MyFacesResponse> => {
  try {
    const response = await api.get(
      `/media/events/${eventId}/faces?similarityThreshold=${similarityThreshold}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error getting my faces:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get photos with your face"
    );
  }
};

/**
 * Get all face detections for an event (Admin/Event Creator only)
 */
export const getAllFaceDetections = async (
  eventId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  message: string;
  faceDetections: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  try {
    const response = await api.get(
      `/media/event/${eventId}/face-detections?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error getting face detections:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get face detections"
    );
  }
};

/**
 * Retrain face identification for an event (Admin/Event Creator only)
 */
export const retrainFaceIdentification = async (
  eventId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post(`/media/event/${eventId}/retrain-faces`);
    return response.data;
  } catch (error: any) {
    console.error("Error retraining face identification:", error);
    throw new Error(
      error.response?.data?.message || "Failed to retrain face identification"
    );
  }
};

/**
 * Get face detections for a specific media item
 */
export const getMediaFaceDetections = async (
  mediaId: string
): Promise<{
  success: boolean;
  message: string;
  faceDetections: any[];
}> => {
  try {
    const response = await api.get(`/faces/media/${mediaId}/faces`);
    return response.data;
  } catch (error: any) {
    console.error("Error getting media face detections:", error);
    throw new Error(
      error.response?.data?.message || "Failed to get face detections for media"
    );
  }
};

/**
 * Compare two faces using Google Vision API
 */
export const compareFaces = async (
  url1: string,
  url2: string
): Promise<{
  success: boolean;
  message: string;
  similarity: number;
  confidence: number;
}> => {
  try {
    const response = await api.post("/faces/compare", {
      faceModelUrl1: url1,
      faceModelUrl2: url2,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error comparing faces:", error);
    throw new Error(error.message || "Failed to compare faces");
  }
};

/**
 * Search for faces using a face model
 */
export const searchByFaceModel = async (
  eventId: string,
  imageFile: File
): Promise<{
  success: boolean;
  message: string;
  matches: FaceMatchResult[];
}> => {
  try {
    const formData = new FormData();
    formData.append("faceModel", imageFile);

    const response = await api.post(
      `/faces/events/${eventId}/search`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error searching by face model:", error);
    throw new Error(error.message || "Failed to search by face model");
  }
};

/**
 * Check if face processing is available for an event
 */
export const checkFaceProcessingStatus = async (
  eventId: string
): Promise<{
  success: boolean;
  message: string;
  isAvailable: boolean;
  trainingStatus?: string;
}> => {
  try {
    const response = await api.get(`/faces/events/${eventId}/status`);
    return response.data;
  } catch (error: any) {
    console.error("Error checking face processing status:", error);
    // If endpoint doesn't exist, assume face processing is not available
    return {
      success: false,
      message: "Face processing not available",
      isAvailable: false,
    };
  }
};
