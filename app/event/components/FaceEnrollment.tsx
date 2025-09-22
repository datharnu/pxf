/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { validateFileSize } from "@/app/utils/s3";
import { isAuthenticated } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { enrollUserFace, getUserFaceProfile } from "@/app/utils/faceApi";
import { FaceEnrollmentProps, FaceEnrollmentResponse } from "@/types/face";

export const FaceEnrollment: React.FC<FaceEnrollmentProps> = ({
  eventId,
  onEnrolled,
}) => {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkAuthAndProceed = () => {
    if (!isAuthenticated()) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/sign-in?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }
    return true;
  };

  const compressImage = (file: File, maxSizeMB: number = 2): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1920 for face detection)
        const maxDimension = 1920;
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          0.8 // 80% quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    // Check authentication first
    if (!checkAuthAndProceed()) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setIsProcessingImage(true);
    setError("");

    try {
      // Validate original file size
      validateFileSize(file);

      let processedFile = file;

      // Compress large images for better face detection
      if (file.size > 5 * 1024 * 1024) {
        // 5MB threshold
        console.log(
          `Compressing large image: ${(file.size / 1024 / 1024).toFixed(1)}MB`
        );
        toast.info("Compressing large image for better face detection...");
        processedFile = await compressImage(file, 2);
        console.log(
          `Compressed to: ${(processedFile.size / 1024 / 1024).toFixed(1)}MB`
        );
        toast.success("Image optimized for face detection");
      }

      setSelectedFile(processedFile);
      setPreview(URL.createObjectURL(processedFile));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to process image"
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleEnroll = async () => {
    if (!selectedFile) return;

    setEnrolling(true);
    setError("");

    try {
      // Validate file before upload using centralized validation
      validateFileSize(selectedFile);

      if (!selectedFile.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      console.log("Starting face enrollment for file:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      const result = await enrollUserFace(eventId, selectedFile);

      if (result.success) {
        setSuccess(true);
        setHasEnrolled(true);
        toast.success("Face enrolled successfully using Google Vision API!");
        toast.info(
          "Face enrollment doesn't count against your photo upload limit!",
          {
            duration: 4000,
          }
        );

        // Show confidence score if available
        if (result.confidence) {
          toast.info(
            `Enrollment confidence: ${(result.confidence * 100).toFixed(1)}%`
          );
        }

        // Call the callback after a brief delay
        setTimeout(() => {
          onEnrolled(result);
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to enroll face");
      }
    } catch (error: any) {
      console.error("Enrollment failed:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to enroll face. Please try again.";

      // Handle different error formats (direct message or nested error object)
      const errorMsg = error.message || error.error?.message || "";

      if (errorMsg.includes("Invalid request")) {
        errorMessage =
          "The image couldn't be processed. Please try a different photo with a clear, well-lit face.";
      } else if (
        errorMsg.includes("No faces detected") ||
        errorMsg.includes("No face detected")
      ) {
        errorMessage =
          "No face detected in the image. Please upload a clear photo with your face visible and ensure good lighting.";
      } else if (errorMsg.includes("Multiple faces")) {
        errorMessage =
          "Multiple faces detected. Please upload a photo with only your face.";
      } else if (errorMsg.includes("Google Vision API")) {
        errorMessage =
          "Google Vision API error. Please check your connection and try again.";
      } else if (errorMsg.includes("access denied")) {
        errorMessage =
          "Google Vision API access denied. Please contact support.";
      } else if (errorMsg) {
        errorMessage = errorMsg;
      }

      console.error("Face enrollment error details:", {
        originalError: error,
        extractedMessage: errorMsg,
        finalMessage: errorMessage,
      });

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const handleRetake = () => {
    setSelectedFile(null);
    setPreview(null);
    setError("");
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Check if user already has a face enrolled for this event
  useEffect(() => {
    const checkExistingEnrollment = async () => {
      try {
        const profile = await getUserFaceProfile(eventId);
        if (profile.success && profile.faceProfile) {
          setHasEnrolled(true);
          setSuccess(true);
        }
      } catch (error) {
        // User doesn't have a face profile yet, which is fine
        console.log("No existing face profile found");
      }
    };

    checkExistingEnrollment();
  }, [eventId]);

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
          <User className="h-8 w-8 text-zinc-900" />
        </div>
        <CardTitle className="text-xl font-semibold text-zinc-50 mb-2">
          Enroll Your Face
        </CardTitle>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Upload a clear photo of yourself to enable face detection and find
          photos with your face automatically.
        </p>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-300 text-xs font-medium">
            Doesn&apos;t count against upload limit
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          disabled={enrolling || hasEnrolled || isProcessingImage}
        />

        {/* Preview or Upload Area */}
        {!preview ? (
          <div
            onClick={
              hasEnrolled || isProcessingImage ? undefined : triggerFileInput
            }
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 group ${
              hasEnrolled
                ? "border-green-500/30 bg-green-500/10 cursor-default"
                : isProcessingImage
                ? "border-amber-500/30 bg-amber-500/10 cursor-default"
                : "border-zinc-600 cursor-pointer hover:border-amber-500/50 hover:bg-zinc-800/30"
            }`}
          >
            <div
              className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-colors ${
                hasEnrolled
                  ? "bg-green-500/20"
                  : isProcessingImage
                  ? "bg-amber-500/20"
                  : "bg-zinc-700/50 group-hover:bg-amber-500/20"
              }`}
            >
              {hasEnrolled ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : isProcessingImage ? (
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-zinc-400 group-hover:text-amber-400" />
              )}
            </div>
            <p className="text-zinc-300 font-medium mb-2">
              {hasEnrolled
                ? "Face Already Enrolled"
                : isProcessingImage
                ? "Processing Image..."
                : "Select Your Photo"}
            </p>
            <p className="text-xs text-zinc-500">
              {hasEnrolled
                ? "Your face has been successfully enrolled for this event"
                : isProcessingImage
                ? "Optimizing image for better face detection"
                : "Choose a clear, well-lit photo of your face"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative w-full aspect-square bg-zinc-800/50 rounded-xl overflow-hidden">
              <Image
                src={preview}
                alt="Face preview"
                fill
                className="object-cover"
              />
              {success && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!success && (
              <div className="flex gap-3">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="flex-1 h-10 border-zinc-600 text-zinc-300 hover:bg-zinc-700/50"
                  disabled={enrolling}
                >
                  <X className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="flex-1 h-10 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Enroll Face
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-300 font-medium">
                Face enrolled successfully!
              </p>
              <p className="text-xs text-green-400">
                You can now find photos with your face in the &quot;My
                Picha&quot; tab.
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        {!preview && !hasEnrolled && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-300">
              Tips for successful face detection:
            </h4>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>• Use a clear, well-lit photo (avoid shadows)</li>
              <li>• Face should be clearly visible and centered</li>
              <li>• Avoid sunglasses, masks, or face coverings</li>
              <li>• Look directly at the camera</li>
              <li>• Only one person should be in the photo</li>
              <li>• Use good quality images (not blurry or pixelated)</li>
              <li>• Large images will be automatically optimized</li>
            </ul>
          </div>
        )}

        {/* Additional help for face detection issues */}
        {error && error.includes("No face detected") && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-amber-300">
              Face detection troubleshooting:
            </h4>
            <ul className="text-xs text-amber-400 space-y-1">
              <li>• Try a different photo with better lighting</li>
              <li>
                • Make sure your face takes up a good portion of the image
              </li>
              <li>• Avoid photos taken from far away</li>
              <li>• Remove any accessories that might obscure your face</li>
              <li>• Try a front-facing photo rather than a profile shot</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
