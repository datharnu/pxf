/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // components/UploadModal.tsx

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { validateFileSize, uploadMultipleToS3 } from "@/app/utils/s3";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: {
    id: string;
    title: string;
    description?: string;
    eventDate: string;
    photoCapLimit: number;
    creator: {
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
      return response.data.stats;
    },
    enabled: isOpen, // Only fetch when modal is open
  });

  if (!isOpen) return null;

  // S3 upload logic is now handled by utility functions

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage("");

    try {
      // Check upload limits (this should now be handled by the backend)
      // But we can still do basic client-side validation

      // Optimistically show reduced remaining uploads while uploading
      const currentRemaining =
        uploadStats?.remainingUploads ?? eventData.photoCapLimit;

      // Check if user has remaining uploads
      if (currentRemaining <= 0) {
        throw new Error(
          `You have reached your upload limit of ${eventData.photoCapLimit} files for this event`
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

      // Submit S3 media to backend
      const submitResponse = await fetch(
        `/api/v1/media/event/${eventData.id}/submit-s3-media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaUrls: s3Results.map((result) => ({
              url: result.url,
              fileName: result.fileName,
              fileSize: result.fileSize,
              mimeType: result.mimeType,
              s3Key: result.key,
            })),
          }),
        }
      );

      if (!submitResponse.ok) {
        throw new Error("Failed to submit media URLs to backend");
      }

      const submitData = await submitResponse.json();

      if (submitData.success) {
        setUploadStatus("success");

        // Check if face processing is happening
        if (submitData.faceProcessing) {
          console.log(
            `Face processing: ${submitData.faceProcessing.imagesProcessed} images processed`
          );
          console.log(`Status: ${submitData.faceProcessing.status}`);
        }

        // Refresh the stats
        await refetchStats();
        setOptimisticRemaining(null);

        // Call the success callback if provided
        if (onUploadSuccess) {
          onUploadSuccess();
        }

        onAddShots(); // Refresh the parent component

        // Close modal after a brief delay
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
        }, 1500);
      } else {
        throw new Error("Failed to submit media URLs");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setIsUploading(false);
      setOptimisticRemaining(null);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Calculate remaining uploads
  const remainingUploads =
    uploadStats?.remainingUploads ?? eventData.photoCapLimit;
  const displayRemaining =
    optimisticRemaining !== null ? optimisticRemaining : remainingUploads;
  const hasUploadsRemaining = displayRemaining > 0;

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
                  {displayRemaining} of {eventData.photoCapLimit} uploads
                  remaining
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {hasUploadsRemaining ? (
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
            onClick={triggerFileInput}
            disabled={isUploading || !hasUploadsRemaining || isLoadingStats}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUploading ? (
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
