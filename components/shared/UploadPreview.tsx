/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

interface UploadPreviewProps {
  file: File;
  uploadProgress: number;
  isComplete: boolean;
  thumbnail: string;
  onRemove?: () => void;
}

export const UploadPreview: React.FC<UploadPreviewProps> = ({
  file,
  uploadProgress,
  isComplete,
  thumbnail,
  onRemove: _onRemove,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    // Use thumbnail if available, otherwise create object URL
    if (thumbnail) {
      setPreviewUrl(thumbnail);
    } else {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, thumbnail]);

  return (
    <div className="relative bg-zinc-800 rounded-lg overflow-hidden">
      {/* Image Preview */}
      <div className="relative aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={file.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isComplete ? "blur-0 opacity-100" : "blur-[2px] opacity-80"
          }`}
        />

        {/* Upload Progress Overlay */}
        {!isComplete && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 mb-2 mx-auto">
                {uploadProgress < 100 ? (
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-amber-500/30 rounded-full"></div>
                    <div
                      className="absolute top-0 left-0 w-8 h-8 border-2 border-amber-500 rounded-full border-r-transparent border-b-transparent animate-spin"
                      style={{
                        transform: `rotate(${(uploadProgress / 100) * 360}deg)`,
                      }}
                    ></div>
                  </div>
                ) : (
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                )}
              </div>
              <p className="text-xs text-white font-medium">
                {uploadProgress < 100 ? `${uploadProgress}%` : "Processing..."}
              </p>
            </div>
          </div>
        )}

        {/* Success Indicator */}
        {isComplete && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3">
        <p className="text-sm text-zinc-300 font-medium truncate">
          {file.name}
        </p>
        <p className="text-xs text-zinc-500">
          {(file.size / (1024 * 1024)).toFixed(1)} MB
        </p>
      </div>
    </div>
  );
};
