export interface MediaItem {
  id: string;
  eventId: string;
  uploadedBy: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  cloudinaryPublicId: string;
  thumbnailUrl?: string; // For progressive loading
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  uploader: {
    id: string;
    fullname: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventInfo {
  id: string;
  title: string;
  photoCapLimit: string;
}

export interface MediaBreakdown {
  image: number;
  video?: number;
}

export interface ParticipantStats {
  totalParticipants: number;
  totalMedia: number;
  totalPhotos: number;
  totalVideos: number;
  mediaBreakdown: MediaBreakdown;
}

export interface EventMediaResponse {
  success: boolean;
  message: string;
  media: MediaItem[];
  pagination: PaginationInfo;
  eventInfo: EventInfo;
  participantStats?: ParticipantStats;
}
