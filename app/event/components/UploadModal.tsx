/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // components/UploadModal.tsx

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { validateFileSize, uploadMultipleToS3 } from "@/app/utils/s3";
import { isAuthenticated } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import { getUploadLimits, isEventCreator } from "@/app/utils/uploadLimits";
import { useUserIdStore } from "@/store/userStore";
import { processingTracker } from "@/app/utils/processingTracker";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: {
    id: string;
    title: string;
    description?: string;
    eventDate: string;
    photoCapLimit: number;
    guestLimit: string;
    customPhotoCapLimit?: number;
    creator: {
      id: string;
      fullname: string;
    };
  };
  onAddShots: () => void;
  onUploadSuccess?: () => void; // Add this prop
}

// S3 upload interfaces (handled by utility functions)

interface MediaUrlData {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  publicId: string;
}

interface MyUploadsStats {
  totalUploads: number;
  remainingUploads: number;
  photoCapLimit: number;
  imagesCount: number;
  videosCount: number;
}

export function UploadModal({
  isOpen,
  onClose,
  eventData,
  onAddShots,
  onUploadSuccess,
}: UploadModalProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [optimisticRemaining, setOptimisticRemaining] = useState<number | null>(
    null
  );

  // Fetch upload stats with proper error handling
  const {
    data: uploadStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<MyUploadsStats>({
    queryKey: ["uploadStats", eventData.id],
    queryFn: async () => {
      const response = await api.get(`/media/event/${eventData.id}/my-uploads`);
      console.log("Backend upload stats response:", response.data);
      return response.data.stats;
    },
    enabled: isOpen, // Only fetch when modal is open
  });

  if (!isOpen) return null;

  // S3 upload logic is now handled by utility functions

  // Check authentication before allowing upload
  const checkAuthAndProceed = () => {
    if (!isAuthenticated()) {
      // Redirect to sign-in page with return URL
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/sign-in?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }
    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check authentication first
    if (!checkAuthAndProceed()) {
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage("");

    try {
      // Check upload limits (this should now be handled by the backend)
      // But we can still do basic client-side validation

      // Use the calculated remaining uploads (accounting for new tiered limits)
      const currentRemaining = remainingUploads;

      // Check if user has remaining uploads
      if (currentRemaining <= 0) {
        throw new Error(
          `You have reached your upload limit of ${userUploadLimit} files for this event as a ${
            userIsCreator ? "creator" : "guest"
          }`
        );
      }

      // Check if trying to upload more than remaining uploads
      if (files.length > currentRemaining) {
        throw new Error(
          `You can only upload ${currentRemaining} more file${
            currentRemaining !== 1 ? "s" : ""
          }`
        );
      }

      setOptimisticRemaining(Math.max(0, currentRemaining - files.length));

      // Upload files to S3 with progress tracking
      const s3Results = await uploadMultipleToS3(
        Array.from(files),
        eventData.id,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Submit S3 media to backend using axios
      console.log("Submitting media URLs to backend for event:", eventData.id);
      console.log("User authenticated:", isAuthenticated());

      // Check authentication token
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      console.log("Auth token present:", !!token);
      console.log(
        "Token preview:",
        token ? token.substring(0, 20) + "..." : "No token"
      );

      console.log("Media payload:", {
        mediaUrls: s3Results.map((result) => ({
          url: result.url,
          fileName: result.fileName,
          fileSize: result.fileSize,
          mimeType: result.mimeType,
          s3Key: result.key,
        })),
      });

      // 🚀 INSTAGRAM-STYLE UPLOAD: Show success immediately, process in background

      // Step 1: Show upload as "complete" immediately for great UX
      setUploadStatus("success");
      setUploadProgress(100);

      // Step 2: Call success callbacks immediately for instant feedback
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      onAddShots(); // Refresh the parent component to show thumbnails immediately

      // Step 3: Close modal quickly for snappy UX
      setTimeout(() => {
        onClose();
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        setOptimisticRemaining(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 800); // Quick close for instant feedback

      // Step 4: Submit to backend in background (Instagram-style processing)
      console.log("🔄 Background processing: Submitting to backend...");

      // Add files to processing tracker for Instagram-style progressive loading
      s3Results.forEach((result) => {
        processingTracker.addProcessingItem(result.key);
      });

      // Process in background - don't await, don't block UX
      api
        .post(`/media/event/${eventData.id}/submit-s3-media`, {
          mediaUrls: s3Results.map((result) => ({
            url: result.url,
            fileName: result.fileName,
            fileSize: result.fileSize,
            mimeType: result.mimeType,
            s3Key: result.key,
            thumbnail: result.thumbnail,
          })),
        })
        .then((submitResponse) => {
          console.log(
            "✅ Background processing complete:",
            submitResponse.data
          );

          // Mark all items as processing complete
          s3Results.forEach((result) => {
            processingTracker.markComplete(result.key);
          });

          // Check if face processing is happening
          if (submitResponse.data.faceProcessing) {
            console.log(
              `Face processing: ${submitResponse.data.faceProcessing.imagesProcessed} images processed`
            );
          }

          // Refresh stats after background processing completes
          refetchStats();
        })
        .catch((error) => {
          console.error("❌ Background processing failed:", error);
          // Mark as complete anyway to avoid permanent processing state
          s3Results.forEach((result) => {
            processingTracker.markComplete(result.key);
          });
        });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setIsUploading(false);
      setOptimisticRemaining(null);
    }
  };

  const triggerFileInput = () => {
    // Check authentication before opening file dialog
    if (!checkAuthAndProceed()) {
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Calculate upload limits based on user role and event guest limit
  const currentUserId = useUserIdStore.getState().userId;
  const userIsCreator = isEventCreator(
    eventData.creator.id,
    currentUserId || undefined
  );
  const userUploadLimit = getUploadLimits(
    eventData.guestLimit,
    eventData.customPhotoCapLimit,
    userIsCreator
  );

  // Calculate remaining uploads - backend now returns correct tiered limits
  const remainingUploads = uploadStats?.remainingUploads ?? userUploadLimit;

  const displayRemaining =
    optimisticRemaining !== null ? optimisticRemaining : remainingUploads;

  // Debug logging for upload limits
  console.log("Upload limits debug:", {
    currentUserId,
    eventCreatorId: eventData.creator.id,
    userIsCreator,
    guestLimit: eventData.guestLimit,
    userUploadLimit,
    customPhotoCapLimit: eventData.customPhotoCapLimit,
    uploadStatsRemainingUploads: uploadStats?.remainingUploads,
    uploadStatsTotalUploads: uploadStats?.totalUploads,
    finalRemainingUploads: remainingUploads,
    displayRemaining,
  });
  const hasUploadsRemaining = displayRemaining > 0;
  const userIsAuthenticated = isAuthenticated();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full shadow-2xl shadow-amber-500/10 border border-zinc-800/50 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-b border-zinc-800/50">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors duration-200 p-1 hover:bg-zinc-800/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pr-8">
            <h2 className="text-xl font-semibold text-zinc-50 mb-2">
              {eventData.title}
            </h2>

            {isLoadingStats ? (
              <div className="inline-flex items-center gap-2 px-3 py-1">
                <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
                <p className="text-sm text-amber-300">Loading upload info...</p>
              </div>
            ) : statsError ? (
              <div className="inline-flex items-center gap-2 px-3 py-1">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-300">
                  Error loading upload info
                </p>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1">
                <p className="text-sm text-amber-300 font-medium">
                  {displayRemaining} of {userUploadLimit} uploads remaining
                </p>
                <span className="text-xs text-amber-400">
                  ({userIsCreator ? "Creator" : "Guest"})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!userIsAuthenticated ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-zinc-400">
                Please sign in to upload your photos and videos to this event.
              </p>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-zinc-900">!</span>
                </div>
                <p className="text-xs text-amber-400">Sign in required</p>
              </div>
            </div>
          ) : hasUploadsRemaining ? (
            <p className="text-sm text-zinc-400 text-center">
              Select your best {displayRemaining} photo(s) or video(s)!
            </p>
          ) : (
            <p className="text-sm text-zinc-400 text-center">
              You&apos;ve reached your upload limit for this event.
            </p>
          )}

          {/* Upload Status */}
          {isUploading && (
            <div className="space-y-3">
              <div className="w-full bg-zinc-800/50 rounded-full h-2.5">
                <div
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center text-zinc-400">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-300">
                  Upload completed successfully!
                </p>
              </div>

              {/* Face Processing Status */}
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-sm text-blue-300 font-medium">
                    Face detection in progress
                  </p>
                  <p className="text-xs text-blue-400">
                    Your photos are being analyzed for face detection
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
            className="hidden"
            disabled={isUploading || !hasUploadsRemaining}
          />

          <Button
            onClick={
              !userIsAuthenticated
                ? () => checkAuthAndProceed()
                : triggerFileInput
            }
            disabled={
              userIsAuthenticated &&
              (isUploading || !hasUploadsRemaining || isLoadingStats)
            }
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {!userIsAuthenticated ? (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Sign In to Upload
              </>
            ) : isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-900 mr-2"></div>
                Uploading... {uploadProgress}%
              </>
            ) : isLoadingStats ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : !hasUploadsRemaining ? (
              "Upload Limit Reached"
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Add Your Media
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isUploading}
            className="w-full h-10 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
