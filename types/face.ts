// Google Vision API Face Detection Types

export interface FaceRectangle {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface FaceMatch {
  faceId: string;
  confidence: number;
  similarity: number;
  faceRectangle: FaceRectangle;
}

export interface FaceMatchResult {
  mediaId: string;
  mediaUrl: string;
  fileName: string;
  mediaType: string;
  matchedFaces: FaceMatch[];
  overallConfidence: number;
}

export interface FaceMatchSummary {
  totalMatches: number;
  highConfidenceMatches: number; // > 0.7
  mediumConfidenceMatches: number; // 0.5 - 0.7
  lowConfidenceMatches: number; // <= 0.5
}

export interface FaceDetection {
  id: string;
  userId: string;
  eventId: string;
  mediaId: string;
  faceId: string;
  persistedFaceId?: string;
  faceRectangle: FaceRectangle;
  faceAttributes?: FaceAttributes;
  confidence: number;
  isIdentified: boolean;
  identifiedUserId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFaceProfile {
  id: string;
  userId: string;
  eventId: string;
  persistedFaceId: string;
  faceId: string;
  enrollmentMediaId: string;
  faceRectangle: FaceRectangle;
  faceAttributes?: FaceAttributes;
  enrollmentConfidence: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Google Vision API Response Types
export interface FaceEnrollmentResponse {
  success: boolean;
  message: string;
  faceProfile?: UserFaceProfile;
  confidence?: number;
}

export interface FaceProfileResponse {
  success: boolean;
  message: string;
  faceProfile?: UserFaceProfile;
}

export interface FaceStatsResponse {
  success: boolean;
  message: string;
  stats: {
    totalFaceDetections: number;
    identifiedFaces: number;
    totalFaceProfiles: number;
    trainingStatus: string;
  };
}

export interface MyFacesResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    matches: FaceMatchResult[];
    summary: FaceMatchSummary;
  };
}

export interface FaceProcessingResponse {
  success: boolean;
  message: string;
  uploadedMedia: Array<{
    id: string;
    mediaUrl: string;
    fileName: string;
  }>;
  faceProcessing?: {
    imagesProcessed: number;
    status: string;
  };
}

// Component Props Types
export interface FaceEnrollmentProps {
  eventId: string;
  onEnrolled: (result: FaceEnrollmentResponse) => void;
}

export interface FaceStatusProps {
  eventId: string;
  onStatusChange?: (hasProfile: boolean) => void;
}

export interface MyFacesViewProps {
  eventId: string;
}

export interface FaceStatsDashboardProps {
  eventId: string;
}

// Face Detection Overlay Props
export interface FaceDetectionOverlayProps {
  faceDetections: FaceDetection[];
  showConfidence?: boolean;
  className?: string;
}
