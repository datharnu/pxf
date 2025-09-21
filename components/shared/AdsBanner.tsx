/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface AdsBannerProps {
  adUrl?: string;
  adTitle?: string;
  adDescription?: string;
  adImageUrl?: string;
  showInterval?: number; // in milliseconds, default 2 minutes
  isVisible?: boolean; // controlled by parent component
  onDismiss?: () => void; // callback when ad is dismissed
}

const AdsBanner = ({
  adUrl = "https://www.rentville.ng",
  adTitle = "Check out our amazing offer!",
  adDescription = "Limited time promotion - don't miss out!",
  adImageUrl = "/picha-logo.png",
  showInterval = 2 * 60 * 1000, // 2 minutes in milliseconds
  isVisible: externalIsVisible = false,
  onDismiss,
}: AdsBannerProps) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show banner when parent component makes it visible
    if (externalIsVisible && !isDismissed) {
      setInternalIsVisible(true);
    } else {
      setInternalIsVisible(false);
    }
  }, [externalIsVisible, isDismissed]);

  const handleDismiss = () => {
    setInternalIsVisible(false);
    setIsDismissed(true);
    // Notify parent component that ad was dismissed
    onDismiss?.();
  };

  const handleVisitAd = () => {
    window.open(adUrl, "_blank", "noopener,noreferrer");
    setInternalIsVisible(false);
    // Notify parent component that ad was dismissed
    onDismiss?.();
  };

  if (!internalIsVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-8 animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-sm">
        {/* Mobile Layout - Stacked */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          {/* Ad Image - Responsive */}
          <div className="flex-shrink-0 order-1 md:order-1">
            <img
              src={adImageUrl}
              alt="Advertisement"
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl object-contain shadow-xl"
            />
          </div>

          {/* Ad Content */}
          <div className="flex-1 min-w-0 order-2 md:order-2 text-center md:text-left">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {adTitle}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              {adDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center md:justify-start items-center gap-3 mt-4">
              <button
                onClick={handleVisitAd}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Site
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 md:relative md:top-auto md:right-auto flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full order-3"
            aria-label="Close advertisement"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdsBanner;
