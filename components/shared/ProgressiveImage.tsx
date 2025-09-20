"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  thumbnailSrc?: string; // Optional thumbnail for instant loading
  priority?: boolean;
  onLoad?: () => void;
  isProcessing?: boolean; // Instagram-style: still processing in backend
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  thumbnailSrc,
  priority = false,
  onLoad,
  isProcessing = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(thumbnailSrc || src);

  useEffect(() => {
    // If we have a thumbnail, start loading the full image in background
    if (thumbnailSrc && thumbnailSrc !== src) {
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setIsError(true);
      };
      img.src = src;
    } else {
      // No thumbnail, load directly
      setIsLoaded(true);
    }
  }, [src, thumbnailSrc, onLoad]);

  const handleLoad = () => {
    if (!thumbnailSrc) {
      setIsLoaded(true);
      onLoad?.();
    }
  };

  const handleError = () => {
    setIsError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-700 ease-out ${
          isProcessing
            ? "blur-[1px] opacity-90"
            : isLoaded
            ? "blur-0 opacity-100"
            : "blur-sm opacity-70"
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        fill={!width && !height}
        sizes={
          !width && !height
            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            : undefined
        }
      />

      {/* Loading overlay */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Processing indicator (Instagram-style) */}
      {isProcessing && (
        <div className="absolute top-2 left-2">
          <div className="bg-amber-500/20 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-300 font-medium">
              Processing
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-zinc-800/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center mb-2 mx-auto">
              <span className="text-zinc-400 text-xs">!</span>
            </div>
            <p className="text-xs text-zinc-400">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
};
