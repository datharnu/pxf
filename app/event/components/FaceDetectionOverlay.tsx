"use client";

import React from "react";
import { FaceDetectionOverlayProps } from "@/types/face";

export const FaceDetectionOverlay: React.FC<FaceDetectionOverlayProps> = ({
  faceDetections,
  showConfidence = true,
  className = "",
}) => {
  if (!faceDetections || faceDetections.length === 0) {
    return null;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {faceDetections.map((detection, index) => (
        <div
          key={detection.id || index}
          className="absolute border-2 border-blue-400 bg-blue-500/20 rounded-sm"
          style={{
            left: `${detection.faceRectangle.left}px`,
            top: `${detection.faceRectangle.top}px`,
            width: `${detection.faceRectangle.width}px`,
            height: `${detection.faceRectangle.height}px`,
          }}
        >
          {/* Confidence Label */}
          {showConfidence && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
              {(detection.confidence * 100).toFixed(0)}%
            </div>
          )}

          {/* Face ID Label (for debugging) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute -bottom-6 left-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
              {detection.isIdentified ? "✓" : "?"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Alternative overlay for percentage-based positioning (useful for responsive layouts)
export const FaceDetectionOverlayPercent: React.FC<
  FaceDetectionOverlayProps
> = ({ faceDetections, showConfidence = true, className = "" }) => {
  if (!faceDetections || faceDetections.length === 0) {
    return null;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {faceDetections.map((detection, index) => (
        <div
          key={detection.id || index}
          className="absolute border-2 border-blue-400 bg-blue-500/20 rounded-sm"
          style={{
            left: `${(detection.faceRectangle.left / 100) * 100}%`,
            top: `${(detection.faceRectangle.top / 100) * 100}%`,
            width: `${(detection.faceRectangle.width / 100) * 100}%`,
            height: `${(detection.faceRectangle.height / 100) * 100}%`,
          }}
        >
          {/* Confidence Label */}
          {showConfidence && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
              {(detection.confidence * 100).toFixed(0)}%
            </div>
          )}

          {/* Face ID Label (for debugging) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute -bottom-6 left-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
              {detection.isIdentified ? "✓" : "?"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Compact overlay for small thumbnails
export const FaceDetectionOverlayCompact: React.FC<
  FaceDetectionOverlayProps
> = ({ faceDetections, showConfidence = false, className = "" }) => {
  if (!faceDetections || faceDetections.length === 0) {
    return null;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {faceDetections.map((detection, index) => (
        <div
          key={detection.id || index}
          className="absolute border border-blue-400 bg-blue-500/30 rounded-sm"
          style={{
            left: `${(detection.faceRectangle.left / 100) * 100}%`,
            top: `${(detection.faceRectangle.top / 100) * 100}%`,
            width: `${(detection.faceRectangle.width / 100) * 100}%`,
            height: `${(detection.faceRectangle.height / 100) * 100}%`,
          }}
        >
          {/* Small confidence indicator */}
          {showConfidence && (
            <div className="absolute -top-3 -right-1 bg-blue-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {(detection.confidence * 100).toFixed(0)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
