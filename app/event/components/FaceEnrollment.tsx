/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef } from "react";
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
import { enrollUserFace } from "@/app/utils/faceApi";
import { FaceEnrollmentProps, FaceEnrollmentResponse } from "@/types/face";

export const FaceEnrollment: React.FC<FaceEnrollmentProps> = ({
  eventId,
  onEnrolled,
}) => {
  const [enrolling, setEnrolling] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
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
      // Validate file before upload
      if (selectedFile.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be less than 10MB");
      }

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
        toast.success("Face enrolled successfully using Google Vision API!");

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

      if (error.message?.includes("Invalid request")) {
        errorMessage =
          "The image couldn't be processed. Please try a different photo with a clear, well-lit face.";
      } else if (error.message?.includes("No faces detected")) {
        errorMessage =
          "No face detected in the image. Please upload a clear photo with your face visible.";
      } else if (error.message?.includes("Multiple faces")) {
        errorMessage =
          "Multiple faces detected. Please upload a photo with only your face.";
      } else if (error.message?.includes("Google Vision API")) {
        errorMessage =
          "Google Vision API error. Please check your connection and try again.";
      } else if (error.message?.includes("access denied")) {
        errorMessage =
          "Google Vision API access denied. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }

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
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          disabled={enrolling}
        />

        {/* Preview or Upload Area */}
        {!preview ? (
          <div
            onClick={triggerFileInput}
            className="border-2 border-dashed border-zinc-600 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 hover:bg-zinc-800/30 transition-all duration-200 group"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-zinc-700/50 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <Camera className="w-6 h-6 text-zinc-400 group-hover:text-amber-400" />
            </div>
            <p className="text-zinc-300 font-medium mb-2">Select Your Photo</p>
            <p className="text-xs text-zinc-500">
              Choose a clear, well-lit photo of your face
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
                You can now find photos with your face in the &quot;My PXF&quot;
                tab.
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        {!preview && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-300">
              Tips for best results:
            </h4>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>• Use a clear, well-lit photo</li>
              <li>• Face should be clearly visible</li>
              <li>• Avoid sunglasses or face coverings</li>
              <li>• Look directly at the camera</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
