/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Camera,
  ArrowLeft,
  X,
  ArrowRightIcon,
  Plus,
  Images,
  Download,
  DoorClosedLocked,
  ArrowRight,
  User,
  Calendar,
  Upload,
  Grid3X3,
  List,
  MoreVertical,
  Share2,
  Check,
  Play,
  Video,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ProgressiveImage } from "@/components/shared/ProgressiveImage";
import { api } from "@/api/axios";
import EventFlyer from "../components/EventFlyer";
import { UploadModal } from "../components/UploadModal";
import { BottomNav } from "../components/BottomNav";
import { EventMediaResponse } from "@/types/media";
import { SelectionActions } from "../components/SelectedAction";
import { MediaActionsMenu } from "../components/MediaActionMenu";
import { ShareModal } from "../components/ShareModal";
import PhotobookComingSoon from "../components/PhotobookModal";
import { isAuthenticated } from "@/app/utils/auth";
import { MyFacesView } from "../components/MyFacesView";
import { FaceStatus } from "../components/FaceStatus";
import { processingTracker } from "@/app/utils/processingTracker";

// Add this interface for the my-uploads response
interface MyUploadsResponse {
  success: boolean;
  message: string;
  uploads: MediaItem[];
  stats: {
    totalUploads: number;
    remainingUploads: number;
    photoCapLimit: number;
    imagesCount: number;
    videosCount: number;
  };
}

// Types
interface EventData {
  id: string;
  title: string;
  description: string;
  eventFlyer?: string;
  guestLimit: string;
  photoCapLimit: string;
  customPhotoCapLimit?: number;
  isPasswordProtected: boolean;
  eventDate: string;
  eventSlug: string;
  creator: {
    id: string;
    fullname: string;
    email: string;
  };
}

interface MediaItem {
  id: string;
  eventId: string;
  uploadedBy: string;
  mediaType: string;
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

interface MediaResponse {
  success: boolean;
  message: string;
  media: MediaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  eventInfo: {
    id: string;
    title: string;
    photoCapLimit: string;
  };
  participantStats: {
    totalParticipants: number;
    totalMedia: number;
    totalPhotos: number;
    totalVideos: number;
    mediaBreakdown: {
      image: number;
      video: number;
    };
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

// Utility functions
const isVideo = (mimeType: string) => {
  return mimeType.startsWith("video/");
};

const isImage = (mimeType: string) => {
  return mimeType.startsWith("image/");
};

// Preview Modal Component
const PreviewModal = ({
  isOpen,
  onClose,
  media,
  allMedia,
}: {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | null;
  allMedia: MediaItem[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (media && allMedia.length > 0) {
      const index = allMedia.findIndex((m) => m.id === media.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [media, allMedia]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen || !media || allMedia.length === 0) return null;

  const currentMedia = allMedia[currentIndex];
  const isVideoFile = isVideo(currentMedia.mimeType);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToPrevious}
        className="absolute left-4 z-50 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 z-50 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
        {isVideoFile ? (
          <video
            src={currentMedia.mediaUrl}
            className="max-w-full max-h-full object-contain"
            controls
            autoPlay
          />
        ) : (
          <Image
            src={currentMedia.mediaUrl}
            alt={currentMedia.fileName}
            fill
            className="object-contain"
            priority={true}
          />
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
        {currentIndex + 1} / {allMedia.length}
      </div>
    </div>
  );
};

// Media Actions Menu Component

// const ShareModal = ({
//   isOpen,
//   onClose,
//   media,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   media: MediaItem[];
// }) => {
//   if (!isOpen) return null;

//   const isVideo = (mimeType: string) => mimeType.startsWith("video/");

//   const shareMediaFiles = async (platform: string) => {
//     try {
//       if (media.length === 1) {
//         const mediaItem = media[0];

//         const response = await fetch(mediaItem.mediaUrl);
//         const blob = await response.blob();
//         const file = new File([blob], mediaItem.fileName, {
//           type: mediaItem.mimeType,
//         });

//         const shareData: ShareData = {
//           files: [file],
//           title: mediaItem.fileName,
//           text: `Check out this ${
//             isVideo(mediaItem.mimeType) ? "video" : "photo"
//           } from the event!`,
//         };

//         if (navigator.canShare && navigator.canShare(shareData)) {
//           await navigator.share(shareData);
//         } else {
//           const text = `Check out this ${
//             isVideo(mediaItem.mimeType) ? "video" : "photo"
//           } from the event!\n${mediaItem.mediaUrl}`;

//           if (platform === "whatsapp") {
//             window.open(
//               `https://wa.me/?text=${encodeURIComponent(text)}`,
//               "_blank"
//             );
//           } else if (platform === "twitter") {
//             window.open(
//               `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//                 text
//               )}`,
//               "_blank"
//             );
//           } else if (platform === "facebook") {
//             window.open(
//               `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//                 mediaItem.mediaUrl
//               )}`,
//               "_blank"
//             );
//           }
//         }
//       } else {
//         const text = `Check out these ${media.length} ${
//           media[0].mimeType.startsWith("video/") ? "videos" : "photos"
//         } from the event!`;
//         const urls = media.map((m) => m.mediaUrl).join("\n");

//         if (platform === "whatsapp") {
//           window.open(
//             `https://wa.me/?text=${encodeURIComponent(text + "\n" + urls)}`,
//             "_blank"
//           );
//         } else if (platform === "twitter") {
//           window.open(
//             `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//               text
//             )}&url=${encodeURIComponent(urls)}`,
//             "_blank"
//           );
//         } else if (platform === "facebook") {
//           window.open(
//             `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//               urls
//             )}`,
//             "_blank"
//           );
//         }
//       }

//       toast.success("Shared successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Error sharing:", error);
//       toast.error("Failed to share. Please try again.");
//     }
//   };

//   const copyToClipboard = async () => {
//     try {
//       const urls = media.map((m) => m.mediaUrl).join("\n");
//       await navigator.clipboard.writeText(urls);
//       toast.success("Links copied to clipboard!");
//       onClose();
//     } catch (err) {
//       toast.error("Failed to copy links");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
//       <div className="bg-zinc-900 rounded-t-3xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold text-zinc-50">
//               Share {media.length > 1 ? `${media.length} items` : "item"}
//             </h3>
//             <button
//               onClick={onClose}
//               className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="space-y-3">
//             <button
//               onClick={() => shareMediaFiles("whatsapp")}
//               className="w-full flex items-center gap-4 p-4 bg-green-600/10 hover:bg-green-600/20 border border-green-600/20 rounded-xl transition-colors"
//             >
//               <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
//                 <Share2 className="w-5 h-5 text-white" />
//               </div>
//               <div className="text-left">
//                 <p className="font-medium text-zinc-200">WhatsApp</p>
//                 <p className="text-sm text-zinc-400">Share to WhatsApp</p>
//               </div>
//             </button>

//             <button
//               onClick={() => shareMediaFiles("twitter")}
//               className="w-full flex items-center gap-4 p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 rounded-xl transition-colors"
//             >
//               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
//                 <Share2 className="w-5 h-5 text-white" />
//               </div>
//               <div className="text-left">
//                 <p className="font-medium text-zinc-200">Twitter</p>
//                 <p className="text-sm text-zinc-400">Share to Twitter</p>
//               </div>
//             </button>

//             <button
//               onClick={() => shareMediaFiles("facebook")}
//               className="w-full flex items-center gap-4 p-4 bg-blue-800/10 hover:bg-blue-800/20 border border-blue-800/20 rounded-xl transition-colors"
//             >
//               <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
//                 <Share2 className="w-5 h-5 text-white" />
//               </div>
//               <div className="text-left">
//                 <p className="font-medium text-zinc-200">Facebook</p>
//                 <p className="text-sm text-zinc-400">Share to Facebook</p>
//               </div>
//             </button>

//             <button
//               onClick={copyToClipboard}
//               className="w-full flex items-center gap-4 p-4 bg-zinc-700/20 hover:bg-zinc-700/40 border border-zinc-700/30 rounded-xl transition-colors"
//             >
//               <div className="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center">
//                 <Download className="w-5 h-5 text-white" />
//               </div>
//               <div className="text-left">
//                 <p className="font-medium text-zinc-200">Copy Links</p>
//                 <p className="text-sm text-zinc-400">Copy to clipboard</p>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default function EventSlugPage() {
  const router = useRouter();
  const params = useParams();

  // Use Next.js params instead of manual URL parsing
  const slug = (params?.id as string) || "";

  console.log(
    "Full URL:",
    typeof window !== "undefined" ? window.location.href : ""
  );
  console.log(
    "Pathname:",
    typeof window !== "undefined" ? window.location.pathname : ""
  );
  console.log("Extracted slug from URL:", slug);
  console.log("Params from useParams:", params);

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [mediaData, setMediaData] = useState<EventMediaResponse | null>(null);
  const [myUploadsData, setMyUploadsData] = useState<MyUploadsResponse | null>(
    null
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState("");
  const [showFlyer, setShowFlyer] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [showPhotobookModal, setShowPhotobookModal] = useState(false);
  // Selection and sharing states
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMedia, setShareMedia] = useState<MediaItem[]>([]);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [hasFaceProfile, setHasFaceProfile] = useState<boolean | null>(null);
  const [isProcessingUploads, setIsProcessingUploads] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // Local storage helpers for remembering event password per slug
  const getStoredEventPassword = (eventSlug: string | null | undefined) => {
    if (typeof window === "undefined" || !eventSlug) return null;
    try {
      return localStorage.getItem(`event_pwd:${eventSlug}`);
    } catch {
      return null;
    }
  };

  const setStoredEventPassword = (
    eventSlug: string | null | undefined,
    value: string
  ) => {
    if (typeof window === "undefined" || !eventSlug) return;
    try {
      localStorage.setItem(`event_pwd:${eventSlug}`, value);
    } catch {}
  };

  const clearStoredEventPassword = (eventSlug: string | null | undefined) => {
    if (typeof window === "undefined" || !eventSlug) return;
    try {
      localStorage.removeItem(`event_pwd:${eventSlug}`);
    } catch {}
  };

  // Participants and user uploads state
  interface ParticipantItem {
    id: string;
    fullname: string;
    uploadsCount?: number;
  }

  interface UserUploadsResponse {
    success: boolean;
    message: string;
    user: { id: string; fullname: string; email?: string };
    uploads: MediaItem[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    eventInfo: { id: string; title: string };
  }

  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [userUploadsData, setUserUploadsData] =
    useState<UserUploadsResponse | null>(null);

  const handlePreview = (media: MediaItem) => {
    setPreviewMedia(media);
    setShowPreviewModal(true);
    setActiveMenuId(null);
  };

  const getEventAccess = async (
    slug: string,
    password?: string
  ): Promise<ApiResponse<EventData>> => {
    try {
      console.log(`Getting event access for slug: ${slug}`);

      const response = await api.post(`/events/access/${slug}`, {
        ...(password && { password }),
      });

      console.log("Event access response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Event access error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        const errorData = error.response.data;
        return {
          success: false,
          requiresPassword: true,
          message: errorData?.message || "Event password required",
        };
      }

      if (error.response?.status === 404) {
        throw new ApiError("Event not found or inactive");
      }

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        return {
          success: false,
          requiresPassword: true,
          message: errorData?.message || "Invalid password",
        };
      }

      return {
        success: false,
        requiresPassword: false,
        message: error.response?.data?.message || "Failed to access event",
      };
    }
  };

  // Function to fetch event media
  // const fetchEventMedia = async (eventId: string) => {
  //   try {
  //     setMediaLoading(true);
  //     console.log(`Fetching media for event: ${eventId}`);

  //     const response = await api.get(`/media/event/${slug}`);
  //     console.log("Media response:", response.data);

  //     if (response.data.success) {
  //       setMediaData(response.data);
  //     } else {
  //       console.warn("Failed to fetch media:", response.data.message);
  //     }
  //   } catch (error: any) {
  //     console.error("Error fetching media:", error);
  //   } finally {
  //     setMediaLoading(false);
  //   }
  // };

  const fetchEventMedia = async (
    eventId: string,
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      // Only show main loading state if not appending (loading more)
      if (!append) {
        setMediaLoading(true);
      }
      console.log(`Fetching media for event: ${eventId}, page: ${page}`);

      const response = await api.get(
        `/media/event/${slug}?page=${page}&limit=20`
      );
      console.log("Media response:", response.data);

      if (response.data.success) {
        if (append && mediaData) {
          // Append new media to existing media
          setMediaData((prevData) => ({
            ...response.data,
            media: [...(prevData?.media || []), ...response.data.media],
          }));
        } else {
          // Replace media with new data
          setMediaData(response.data);
        }

        // Update pagination state
        setCurrentPage(response.data.pagination.page);
        setHasMorePages(
          response.data.pagination.page < response.data.pagination.totalPages
        );
      } else {
        console.warn("Failed to fetch media:", response.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching media:", error);
    } finally {
      if (!append) {
        setMediaLoading(false);
      }
    }
  };

  // Fetch participants
  const fetchParticipants = async (eventId: string) => {
    try {
      const response = await api.get(`/media/event/${eventId}/participants`);
      const raw = response.data || {};
      const participantsArray =
        raw.participants || raw.users || raw.data || raw || [];
      if (Array.isArray(participantsArray)) {
        const list: ParticipantItem[] = participantsArray.map((p: any) => ({
          id: p?.user?.id ?? p?.id ?? p?.uploadedBy,
          fullname: p?.user?.fullname ?? p?.fullname ?? "Unknown User",
          uploadsCount: p?.uploadCount ?? p?.uploadsCount,
          imagesCount: p?.imagesCount ?? p?.mediaBreakdown?.image ?? 0,
          videosCount: p?.videosCount ?? p?.mediaBreakdown?.video ?? 0,
        }));
        setParticipants(list.filter((x) => Boolean(x.id)));
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // Fetch uploads for a specific user
  const fetchUserUploads = async (
    eventId: string,
    userId: string,
    page: number = 1,
    mediaType?: "image" | "video"
  ) => {
    try {
      setMediaLoading(true);
      const mt = mediaType ? `&mediaType=${mediaType}` : "";
      const response = await api.get(
        `/media/event/${eventId}/user/${userId}?page=${page}&limit=20${mt}`
      );
      if (response.data?.success) {
        setUserUploadsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user uploads:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  const loadMoreMedia = async () => {
    if (eventData && hasMorePages && !loadingMore) {
      const nextPage = currentPage + 1;
      console.log(
        `Loading more media - current page: ${currentPage}, next page: ${nextPage}`
      );
      setLoadingMore(true);
      await fetchEventMedia(eventData.id, nextPage, true);
      setLoadingMore(false);
    }
  };

  // Function to fetch user uploads
  const fetchMyUploads = async (eventId: string) => {
    try {
      setMediaLoading(true);
      console.log(`Fetching my uploads for event: ${eventId}`);

      const response = await api.get(`/media/event/${eventId}/my-uploads`);
      console.log("My uploads response:", response.data);

      if (response.data.success) {
        setMyUploadsData(response.data);
      } else {
        console.warn("Failed to fetch my uploads:", response.data.message);
        toast.error("Failed to fetch your uploads");
      }
    } catch (error: any) {
      console.error("Error fetching my uploads:", error);
      toast.error("Failed to fetch your uploads");
    } finally {
      setMediaLoading(false);
    }
  };

  const downloadSingleMedia = async (media: MediaItem) => {
    try {
      toast.loading("Preparing download...");

      const response = await fetch(media.mediaUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = media.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Download started!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download file");
    }
  };

  const downloadMultipleMedia = async (mediaItems: MediaItem[]) => {
    try {
      toast.loading(`Preparing ${mediaItems.length} downloads...`);

      for (let i = 0; i < mediaItems.length; i++) {
        const media = mediaItems[i];

        setTimeout(async () => {
          try {
            const response = await fetch(media.mediaUrl);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = media.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error(`Failed to download ${media.fileName}:`, error);
          }
        }, i * 500);
      }

      setTimeout(() => {
        toast.dismiss();
        toast.success(`Started ${mediaItems.length} downloads!`);
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to start downloads");
    }
  };

  const toggleMediaSelection = (media: MediaItem) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((item) => item.id === media.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== media.id);
      } else {
        return [...prev, media];
      }
    });
  };

  const clearSelection = () => {
    setSelectedMedia([]);
  };

  const isMediaSelected = (mediaId: string) => {
    return selectedMedia.some((item) => item.id === mediaId);
  };

  const handleShare = (media: MediaItem[]) => {
    setShareMedia(media);
    setShowShareModal(true);
    setActiveMenuId(null);
  };

  const toggleMenu = (mediaId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveMenuId(activeMenuId === mediaId ? null : mediaId);
  };

  const closeMenu = () => {
    setActiveMenuId(null);
  };

  const processEventAccess = async (
    slug: string | any,
    password?: string
  ): Promise<{
    success: boolean;
    needsPassword: boolean;
    event?: EventData;
    message?: string;
  }> => {
    try {
      console.log("Processing event access for slug:", slug);

      const result = await getEventAccess(slug, password);

      if (result.success && result.event) {
        console.log("Event access successful");
        return {
          success: true,
          needsPassword: false,
          event: result.event,
        };
      }

      if (result.requiresPassword) {
        console.log("Password required");
        return {
          success: false,
          needsPassword: true,
          message: result.message || "Password required",
        };
      }

      console.log("Event access failed");
      return {
        success: false,
        needsPassword: false,
        message: result.message || "Failed to access event",
      };
    } catch (error: any) {
      console.error("Process Event Access Error:", error);

      return {
        success: false,
        needsPassword: false,
        message: error.message || "An error occurred while accessing the event",
      };
    }
  };

  const handleUploadClick = () => {
    if (!isAuthenticated()) {
      toast.error("Please sign in to upload photos");
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/";
      router.push(`/sign-in?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    setShowUploadModal(true);
  };

  const handleMediaUpload = () => {
    if (eventData) {
      // Refresh the appropriate data based on current filter
      if (activeFilter === "all") {
        // Reset to page 1 on upload to show latest media
        setCurrentPage(1);
        fetchEventMedia(eventData.id, 1, false);
      } else {
        fetchMyUploads(eventData.id);
      }

      // Check for processing items and start monitoring if needed
      setTimeout(() => {
        const hasProcessing = checkProcessingStatus();
        if (hasProcessing) {
          startPeriodicRefresh();
        }
      }, 1000); // Small delay to allow processing tracker to be updated
    }
  };

  // Check if uploads are still processing
  const checkProcessingStatus = () => {
    const processingItems = processingTracker.getProcessingItems();
    const hasProcessingItems = processingItems.length > 0;
    const wasProcessing = isProcessingUploads;

    setIsProcessingUploads(hasProcessingItems);

    if (hasProcessingItems && !wasProcessing) {
      // Just started processing
      console.log(
        `🔄 ${processingItems.length} uploads still processing:`,
        processingItems
      );
      toast.info("Uploads are processing in the background", {
        description: "Your photos will appear once processing is complete",
        duration: 4000,
      });
    } else if (!hasProcessingItems && wasProcessing) {
      // Just finished processing
      console.log("✅ All uploads processing complete");
      toast.success("All uploads processed successfully!", {
        duration: 3000,
      });
    } else if (hasProcessingItems) {
      console.log(
        `🔄 ${processingItems.length} uploads still processing:`,
        processingItems
      );
    }

    return hasProcessingItems;
  };

  // Manual refresh function
  const handleRefresh = () => {
    if (eventData) {
      console.log("🔄 Manual refresh triggered");
      if (activeFilter === "all") {
        // Reset to page 1 on manual refresh to avoid pagination issues
        setCurrentPage(1);
        fetchEventMedia(eventData.id, 1, false);
      } else if (activeFilter === "my") {
        fetchMyUploads(eventData.id);
      } else if (activeFilter.startsWith("user:")) {
        const userId = activeFilter.split(":")[1];
        if (userId) {
          fetchUserUploads(eventData.id, userId, 1);
        }
      }
    }
  };

  // Start periodic refresh when uploads are processing
  const startPeriodicRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const interval = setInterval(() => {
      const stillProcessing = checkProcessingStatus();
      if (!stillProcessing) {
        // Stop periodic refresh when processing is complete
        clearInterval(interval);
        setRefreshInterval(null);
        console.log("🔄 Stopping periodic refresh - all uploads complete");
      } else {
        // Refresh media data while processing
        handleRefresh();
      }
    }, 3000); // Check every 3 seconds

    setRefreshInterval(interval);
  };

  // Stop periodic refresh
  const stopPeriodicRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  useEffect(() => {
    if (slug) {
      console.log("useEffect triggered with slug:", slug);
      checkEventAccess();
    } else {
      console.log("No slug found in URL");
      setError("No event specified");
      setLoading(false);
    }
  }, [slug]);

  // Fetch media when event data is loaded or filter changes
  useEffect(() => {
    if (eventData && !needsPassword) {
      if (activeFilter === "all") {
        // Reset to page 1 when switching to "All" tab
        setCurrentPage(1);
        fetchEventMedia(eventData.id, 1, false);
      } else if (activeFilter === "my") {
        // My uploads doesn't seem to have pagination based on the API response
        fetchMyUploads(eventData.id);
      } else if (activeFilter.startsWith("user:") && eventData.id) {
        const userId = activeFilter.split(":")[1];
        if (userId) {
          fetchUserUploads(eventData.id, userId, 1);
        }
      }
    }
  }, [eventData, needsPassword, activeFilter]);

  // Check processing status on mount and when component becomes visible
  useEffect(() => {
    const hasProcessing = checkProcessingStatus();
    if (hasProcessing) {
      startPeriodicRefresh();
    }

    // Cleanup on unmount
    return () => {
      stopPeriodicRefresh();
    };
  }, []);

  // Monitor processing status changes
  useEffect(() => {
    const hasProcessing = checkProcessingStatus();
    if (hasProcessing && !refreshInterval) {
      startPeriodicRefresh();
    } else if (!hasProcessing && refreshInterval) {
      stopPeriodicRefresh();
    }
  }, [mediaData, myUploadsData, userUploadsData]);

  const checkEventAccess = async () => {
    try {
      console.log("checkEventAccess function called with slug:", slug);
      setLoading(true);
      setError("");

      // First attempt without password
      let result = await processEventAccess(slug);
      console.log("processEventAccess returned:", result);

      // If password is needed, try using stored password automatically
      if (!result.success && result.needsPassword) {
        const stored = getStoredEventPassword(slug);
        if (stored) {
          console.log("Trying stored password for slug", slug);
          const retry = await processEventAccess(slug, stored);
          if (retry.success && retry.event) {
            result = retry;
          } else if (retry.needsPassword) {
            // Stored password invalid now; clear it
            clearStoredEventPassword(slug);
            result = retry;
          } else {
            result = retry;
          }
        }
      }

      if (result.success && result.event) {
        setEventData(result.event);
        setNeedsPassword(false);
        // Preload participants for chooser
        fetchParticipants(result.event.id);
      } else if (result.needsPassword) {
        setNeedsPassword(true);
      } else {
        setError(result.message || "Event not found");
      }
    } catch (err: any) {
      console.error("Error accessing event:", err);
      setError("Failed to load event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter the event password");
      return;
    }

    try {
      setVerifying(true);

      const result = await processEventAccess(slug, password);

      if (result.success && result.event) {
        setEventData(result.event);
        setNeedsPassword(false);
        // Remember the successful password for this event slug
        setStoredEventPassword(slug, password);
        toast.success("Access granted! Welcome to the event.");
      } else if (result.needsPassword) {
        // Ensure we do not keep an invalid stored password
        clearStoredEventPassword(slug);
        toast.error(result.message || "Invalid password");
      } else {
        toast.error(result.message || "Failed to access event");
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error("Failed to verify password. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${month}.${day}.${year}`;
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const navigateToEvent = () => {
    router.push(`/event/${slug}`);
  };

  const handleTakePhotos = () => {
    setShowFlyer(false);
  };

  const handleCloseFlyerOrCancel = () => {
    setShowFlyer(false);
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Render content based on active filter
  const renderContent = () => {
    if (!eventData) return null;

    if (activeFilter === "my" && hasFaceProfile === false) {
      // Show face enrollment if no face profile exists
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">My Picha</h2>
            <p className="text-zinc-400">Photos with Your Face</p>
          </div>
          <FaceStatus
            eventId={eventData.id}
            onStatusChange={setHasFaceProfile}
          />
        </div>
      );
    } else if (activeFilter === "my" && hasFaceProfile === true) {
      // Show face-detected photos
      return <MyFacesView eventId={eventData.id} />;
    } else if (activeFilter === "my") {
      // Show regular my uploads while checking face profile
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">My Picha</h2>
            <p className="text-zinc-400">Photos with Your Face</p>
          </div>
          <FaceStatus
            eventId={eventData.id}
            onStatusChange={setHasFaceProfile}
          />
        </div>
      );
    }

    // Default content for other tabs
    return null;
  };

  // Determine which media to display based on active filter
  const displayMedia =
    activeFilter === "my" && myUploadsData
      ? myUploadsData.uploads
      : activeFilter.startsWith("user:") && userUploadsData
      ? userUploadsData.uploads
      : mediaData?.media || [];

  // Debug media data
  console.log("Media display debug:", {
    activeFilter,
    mediaDataExists: !!mediaData,
    mediaCount: mediaData?.media?.length || 0,
    myUploadsDataExists: !!myUploadsData,
    displayMediaCount: displayMedia.length,
    firstMedia: displayMedia[0] || null,
  });

  // Determine which stats to display based on active filter
  const displayStats =
    activeFilter === "my" && myUploadsData
      ? {
          totalPhotos: myUploadsData.stats.imagesCount,
          totalVideos: myUploadsData.stats.videosCount,
          totalParticipants: 1, // Just the current user
          totalMedia: myUploadsData.stats.totalUploads,
        }
      : activeFilter.startsWith("user:") && userUploadsData
      ? {
          totalPhotos: userUploadsData.uploads.filter((m) =>
            isImage(m.mimeType)
          ).length,
          totalVideos: userUploadsData.uploads.filter((m) =>
            isVideo(m.mimeType)
          ).length,
          totalParticipants: 1,
          totalMedia: userUploadsData.uploads.length,
        }
      : mediaData?.participantStats || {
          totalPhotos: 0,
          totalVideos: 0,
          totalParticipants: 0,
          totalMedia: 0,
        };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-2 text-lg">Loading event...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Event Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Go Home
              </Button>
              <Button
                variant="outline"
                onClick={checkEventAccess}
                className="w-full"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900/95 backdrop-blur-sm border-amber-200/20 shadow-2xl shadow-amber-500/10">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <DoorClosedLocked className="h-8 w-8 text-zinc-900" />
            </div>
            <CardTitle className="text-2xl font-semibold text-zinc-50 mb-2">
              Secure Access
            </CardTitle>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This event requires authentication. Enter your access code to
              continue.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Access code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12 h-12 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400/50 focus:ring-amber-400/20 transition-all duration-200"
                  disabled={verifying}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors duration-200 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={verifying || !password.trim()}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>Access Event</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-900 px-3 text-zinc-500">or</span>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="w-full h-11 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Return to homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (eventData && showFlyer && eventData.eventFlyer) {
    return (
      <EventFlyer
        flyer={eventData.eventFlyer}
        title={eventData.title}
        date={formatDate(eventData.eventDate)}
        onTakePhotos={handleTakePhotos}
        onClose={handleCloseFlyerOrCancel}
      />
    );
  }

  if (eventData) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="max-w-7xl mx-auto">
          {/* Event Header */}
          <div className="relative">
            {/* Mobile Layout */}
            <div className="block md:hidden [@media(min-width:425px)]:pb-5  [@media(min-width:375px)]:pb-8">
              <div className="flex flex-col gap-6">
                {/* Event Flyer Thumbnail */}
                {eventData.eventFlyer && (
                  <div className="w-full">
                    <div
                      className="relative [@media(min-width:425px)]:aspect-[7/4] [@media(min-width:375px)]:aspect-[5/3] overflow-hidden cursor-pointer"
                      onClick={() => setShowFlyer(true)}
                    >
                      <Image
                        src={eventData.eventFlyer}
                        alt={eventData.title}
                        fill
                        className="object-cover hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary to-transparent"></div>
                    </div>
                  </div>
                )}

                {/* Event Details */}
                <div className="absolute px-3">
                  {/* Back Button */}
                  <div className="mt-5">
                    <button
                      onClick={handleBack}
                      className="text-white hover:bg-white/10 bg-[#f0eded]/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-14 space-y-3">
                    <p className="text-zinc-300 font-bold text-xs">
                      ENDING: {formatDate(eventData.eventDate)}
                    </p>
                    <p className="font-bold text-lg text-white ">
                      {eventData.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-300 mt-3">
                    <p>{displayStats.totalPhotos} Photos</p> .
                    <p>{displayStats.totalVideos} Videos</p> .
                    <p>{displayStats.totalParticipants} Participants</p>
                  </div>
                  <div className="flex gap-3 items-center pt-4">
                    <button
                      className="flex items-center gap-1  bg-[#494949] backdrop-blur-sm px-3 py-2.5 rounded-full hover:bg-zinc-700/70 transition-all duration-200"
                      onClick={handleUploadClick}
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span className="text-white text-xs font-bold">
                        Upload
                      </span>
                    </button>
                    <button
                      className="flex items-center gap-2 bg-[#494949] backdrop-blur-sm px-3 py-2.5 rounded-full hover:bg-zinc-700/70 transition-all duration-200"
                      onClick={() => downloadMultipleMedia(displayMedia)}
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span className="text-white text-xs font-bold">
                        Export
                      </span>
                    </button>
                    <button
                      onClick={() => setShowPhotobookModal(true)}
                      className="flex items-center gap-2  bg-[#494949] backdrop-blur-sm px-3 py-2.5 rounded-full hover:bg-zinc-700/70 transition-all duration-200"
                    >
                      <Images className="w-4 h-4 text-amber-400" />
                      <span className="text-white text-xs font-bold">
                        Photobook
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-t-3 border-dashed p-2 border-[#494949] mx-4 md:hidden" />

            {/* Tablet & Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                {/* Event Flyer */}
                {eventData.eventFlyer && (
                  <div className="w-full lg:w-2/5 xl:w-1/3">
                    <div
                      className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-amber-500/10"
                      onClick={() => setShowFlyer(true)}
                    >
                      <Image
                        src={eventData.eventFlyer}
                        alt={eventData.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-zinc-900/70 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Upload className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Details */}
                <div className="flex-1 space-y-6 mb-20">
                  {/* Back Button */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleBack}
                      className="text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 backdrop-blur-sm rounded-xl p-3 transition-all duration-200 hover:bg-zinc-700/50 group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    </button>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full border border-amber-500/30">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-amber-300 text-sm font-medium">
                        Active Event
                      </span>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-amber-400 font-semibold text-sm mb-2">
                        ENDING: {formatDate(eventData.eventDate)}
                      </p>
                      <h1 className="font-bold text-3xl lg:text-4xl text-zinc-50 leading-tight">
                        {eventData.title}
                      </h1>
                    </div>

                    {/* Event Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-zinc-300 font-medium">
                            {formatDate(eventData.eventDate)}
                          </p>
                          <p className="text-zinc-500 text-xs">Event Date</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-zinc-300 font-medium">
                            {eventData.creator.fullname}
                          </p>
                          <p className="text-zinc-500 text-xs">Event Host</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                          <Camera className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-zinc-300 font-medium">
                            {eventData.photoCapLimit} photos
                          </p>
                          <p className="text-zinc-500 text-xs">Per Person</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-zinc-300">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-zinc-50">
                          {displayStats.totalPhotos}
                        </p>
                        <p className="text-xs text-zinc-400">Photos</p>
                      </div>
                      <div className="w-px h-8 bg-zinc-700"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-zinc-50">
                          {displayStats.totalVideos}
                        </p>
                        <p className="text-xs text-zinc-400">Videos</p>
                      </div>
                      <div className="w-px h-8 bg-zinc-700"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-zinc-50">
                          {displayStats.totalParticipants}
                        </p>
                        <p className="text-xs text-zinc-400">Participants</p>
                      </div>
                    </div>

                    {/* Description */}
                    {eventData.description && (
                      <div className="p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700/30">
                        <p className="text-zinc-300 leading-relaxed">
                          {eventData.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-3 rounded-xl text-zinc-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                      onClick={handleUploadClick}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Upload Photos</span>
                    </button>

                    <button
                      className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm px-6 py-3 rounded-xl text-zinc-200 font-medium border border-zinc-700/50 transition-all duration-200 hover:border-zinc-600/50"
                      onClick={() => downloadMultipleMedia(displayMedia)}
                    >
                      <Download className="w-5 h-5 text-amber-400" />
                      <span>Export All</span>
                    </button>

                    <button className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm px-6 py-3 rounded-xl text-zinc-200 font-medium border border-zinc-700/50 transition-all duration-200 hover:border-zinc-600/50">
                      <Images className="w-5 h-5 text-amber-400" />
                      <span>Create Photobook</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery Section */}
          <div className="px-4 md:px-6 lg:px-8 pb-24">
            {/* Face Detection Content */}
            {activeFilter === "my" ? (
              renderContent()
            ) : (
              <>
                {/* Gallery Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-zinc-50">
                        Event Gallery{" "}
                        {activeFilter === "my" ? "(My Uploads)" : ""}
                      </h2>
                      {/* Processing indicator */}
                      {isProcessingUploads && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-blue-300 text-xs font-medium">
                            Processing
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {mediaLoading
                        ? "Loading..."
                        : `${displayStats.totalPhotos} photos, ${displayStats.totalVideos} videos`}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    {/* Refresh Button */}
                    <button
                      onClick={handleRefresh}
                      disabled={mediaLoading}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isProcessingUploads
                          ? "bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30"
                          : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                      } ${mediaLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={
                        isProcessingUploads
                          ? "Uploads are processing - auto-refreshing"
                          : "Refresh gallery"
                      }
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          isProcessingUploads ? "animate-spin" : ""
                        }`}
                      />
                    </button>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-amber-500 text-zinc-900"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-amber-500 text-zinc-900"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {mediaLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    <span className="ml-3 text-zinc-300">Loading media...</span>
                  </div>
                )}

                {/* Empty State */}
                {!mediaLoading && displayMedia.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-zinc-800/50 rounded-2xl flex items-center justify-center">
                      {isProcessingUploads ? (
                        <RefreshCw className="w-10 h-10 text-blue-400 animate-spin" />
                      ) : (
                        <Camera className="w-10 h-10 text-zinc-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                      {isProcessingUploads
                        ? "Processing your uploads..."
                        : activeFilter === "my"
                        ? "No uploads yet"
                        : "No media yet"}
                    </h3>
                    <p className="text-zinc-500 mb-6 max-w-md mx-auto">
                      {isProcessingUploads
                        ? "Your photos and videos are being processed. They'll appear here once ready!"
                        : activeFilter === "my"
                        ? "You haven't uploaded any media to this event yet. Upload your photos and videos to get started!"
                        : "Be the first to share memories from this event. Upload your photos and videos to get started!"}
                    </p>
                    {!isProcessingUploads && (
                      <button
                        onClick={handleUploadClick}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-3 rounded-xl text-zinc-900 font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        Upload Media
                      </button>
                    )}
                  </div>
                )}

                {/* Grid View */}
                {!mediaLoading &&
                  displayMedia.length > 0 &&
                  viewMode === "grid" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {displayMedia.map((media) => (
                        <div
                          key={media.id}
                          className={`group relative aspect-square bg-zinc-800/30 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                            isMediaSelected(media.id)
                              ? "border-amber-500/50 ring-2 ring-amber-500/30"
                              : "border-zinc-700/30 hover:border-amber-500/30"
                          }`}
                          onClick={() => toggleMediaSelection(media)}
                        >
                          {/* Selection indicator */}
                          {isMediaSelected(media.id) && (
                            <div className="absolute top-3 left-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center z-10">
                              <Check className="w-4 h-4 text-zinc-900" />
                            </div>
                          )}

                          {/* Media Content */}
                          {isVideo(media.mimeType) ? (
                            <div className="relative w-full h-full">
                              <video
                                src={media.mediaUrl}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                preload="metadata"
                              />
                              {/* Video play button overlay */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <Play className="w-6 h-6 text-white ml-1" />
                                </div>
                              </div>
                              {/* Video indicator */}
                              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full p-1">
                                <Video className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={media.mediaUrl}
                              alt={media.fileName}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Overlay: always visible on mobile/tablet, hover on large screens */}
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                            <div className="absolute bottom-3 left-3 right-3">
                              <p className="text-white text-sm font-medium truncate mb-1">
                                {media.fileName}
                              </p>
                              <div className="flex justify-between items-center text-xs text-zinc-300">
                                <span>
                                  {media.uploader
                                    ? media.uploader.fullname
                                    : "You"}
                                </span>
                                <span>{formatFileSize(media.fileSize)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions menu button: always visible on mobile/tablet, hover on large screens */}
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={(e) => toggleMenu(media.id, e)}
                              className="bg-zinc-900/70 backdrop-blur-sm rounded-full p-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 hover:bg-zinc-800/90"
                            >
                              <MoreVertical className="w-4 h-4 text-white" />
                            </button>

                            {/* Actions Menu */}
                            <MediaActionsMenu
                              media={media}
                              isOpen={activeMenuId === media.id}
                              onClose={closeMenu}
                              onDownload={() => {
                                downloadSingleMedia(media);
                                closeMenu();
                              }}
                              onShare={() => {
                                handleShare([media]);
                                closeMenu();
                              }}
                              onPreview={() => {
                                handlePreview(media);
                                closeMenu();
                              }}
                              onDeleteSuccess={() => {
                                // Refresh the media data after deletion
                                if (activeFilter === "all") {
                                  fetchEventMedia(eventData.id);
                                } else {
                                  fetchMyUploads(eventData.id);
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* List View */}
                {!mediaLoading &&
                  displayMedia.length > 0 &&
                  viewMode === "list" && (
                    <div className="space-y-3">
                      {displayMedia.map((media) => (
                        <div
                          key={media.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isMediaSelected(media.id)
                              ? "bg-zinc-800/50 border-amber-500/50"
                              : "bg-zinc-800/30 border-zinc-700/30 hover:border-amber-500/30"
                          }`}
                          onClick={() => toggleMediaSelection(media)}
                        >
                          {/* Selection checkbox */}
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isMediaSelected(media.id)
                                ? "bg-amber-500 border-amber-500"
                                : "border-zinc-600 hover:border-amber-500"
                            }`}
                          >
                            {isMediaSelected(media.id) && (
                              <Check className="w-3 h-3 text-zinc-900" />
                            )}
                          </div>

                          {/* Thumbnail */}
                          <div className="relative w-16 h-16 bg-zinc-700/50 rounded-lg overflow-hidden flex-shrink-0">
                            {isVideo(media.mimeType) ? (
                              <div className="relative w-full h-full">
                                <video
                                  src={media.mediaUrl}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <Play className="w-3 h-3 text-white ml-0.5" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={media.mediaUrl}
                                alt={media.fileName}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Media Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-zinc-200 truncate">
                                {media.fileName}
                              </h4>
                              {isVideo(media.mimeType) && (
                                <div className="bg-zinc-700 rounded-full p-1">
                                  <Video className="w-3 h-3 text-zinc-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                              {/* <span>{media.uploader.fullname}</span>
                          <span>{formatFileSize(media.fileSize)}</span> */}
                              <span>
                                {new Date(media.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadSingleMedia(media);
                              }}
                              className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare([media]);
                              }}
                              className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Load More Button */}
                {hasMorePages && activeFilter === "all" && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMoreMedia}
                      disabled={loadingMore || mediaLoading}
                      className="bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm px-6 py-3 rounded-xl text-zinc-200 font-medium border border-zinc-700/50 transition-all duration-200 hover:border-zinc-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center">
                        {loadingMore && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Load More Media
                        <span className="ml-2 text-zinc-400">
                          ({currentPage} of{" "}
                          {mediaData?.pagination?.totalPages || 1})
                        </span>
                      </span>
                    </button>
                  </div>
                )}

                {/* Subtle loading indicator when loading more */}
                {loadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading more media...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Selection Actions */}
          <SelectionActions
            selectedMedia={selectedMedia}
            onDownload={() => downloadMultipleMedia(selectedMedia)}
            onShare={() => handleShare(selectedMedia)}
            onClearSelection={clearSelection}
          />

          {/* Share Modal */}
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            media={shareMedia}
          />

          {/* Preview Modal */}
          <PreviewModal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            media={previewMedia}
            allMedia={displayMedia}
          />

          {/* <PhotobookComingSoon
            isOpen={showPhotobookModal}
            onClose={() => setShowPhotobookModal(false)}
          /> */}

          <UploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            eventData={{
              ...eventData,
              photoCapLimit: Number(eventData.photoCapLimit),
              guestLimit: eventData.guestLimit,
              customPhotoCapLimit: eventData.customPhotoCapLimit,
              creator: {
                id: eventData.creator.id,
                fullname: eventData.creator.fullname,
              },
            }}
            onAddShots={navigateToEvent}
            onUploadSuccess={() => {
              // Refresh the media data based on the current filter
              if (activeFilter === "all") {
                // Reset to page 1 on upload to show latest media
                setCurrentPage(1);
                fetchEventMedia(eventData.id, 1, false);
              } else {
                fetchMyUploads(eventData.id);
              }
            }}
          />

          {/* Add the BottomNav component */}
          <BottomNav
            activeTab={activeFilter}
            onTabChange={(tab) => {
              setActiveFilter(tab);
              if (!eventData) return;
              if (tab === "all") {
                // Reset to page 1 when switching to "All" tab
                setCurrentPage(1);
                fetchEventMedia(eventData.id, 1, false);
              } else if (tab === "my") {
                fetchMyUploads(eventData.id);
              } else if (tab.startsWith("user:")) {
                const userId = tab.split(":")[1];
                if (userId) fetchUserUploads(eventData.id, userId, 1);
              }
            }}
            participants={participants}
            onSelectUser={(user) => {
              if (eventData) {
                fetchUserUploads(eventData.id, user.id, 1);
              }
            }}
            onOpenChooser={() => {
              if (eventData?.id) {
                fetchParticipants(eventData.id);
              }
            }}
            allCounts={{
              photos: displayStats.totalPhotos,
              videos: displayStats.totalVideos,
            }}
            myCounts={
              myUploadsData
                ? {
                    photos: myUploadsData.stats.imagesCount,
                    videos: myUploadsData.stats.videosCount,
                  }
                : undefined
            }
          />
        </div>
      </div>
    );
  }

  return null;
}
