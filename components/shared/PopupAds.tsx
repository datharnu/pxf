/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface PopupAdsProps {
  adUrl?: string;
  adTitle?: string;
  adDescription?: string;
  adImageUrl?: string;
  showInterval?: number; // in milliseconds, default 2 minutes
  isVisible?: boolean; // controlled by parent component
}

const PopupAds = ({
  adUrl = "https://www.rentville.ng",
  adTitle = "Find Your Perfect Rental Home!",
  adDescription = "Discover amazing rental properties with Rentville - your trusted rental platform.",
  adImageUrl = "/rentville.png",
  showInterval = 2 * 60 * 1000, // 2 minutes in milliseconds
  isVisible: externalIsVisible = false,
}: PopupAdsProps) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show popup when parent component makes it visible
    if (externalIsVisible && !isDismissed) {
      setInternalIsVisible(true);
    } else {
      setInternalIsVisible(false);
    }
  }, [externalIsVisible, isDismissed]);

  const handleDismiss = () => {
    setInternalIsVisible(false);
    setIsDismissed(true);
    // Reset dismissed state after a short delay to allow popup to show again in next cycle
    setTimeout(() => setIsDismissed(false), 1000);
  };

  const handleVisitAd = () => {
    window.open(adUrl, "_blank", "noopener,noreferrer");
    setInternalIsVisible(false);
  };

  const handleOverlayClick = () => {
    setInternalIsVisible(false);
  };

  if (!internalIsVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop Overlay with Blur */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={handleOverlayClick}
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Popup Content */}
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-10 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="Close advertisement"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ad Image - Extra Large and Centered */}
          <div className="p-6 pb-4">
            <div className="flex justify-center mb-4">
              <img
                src={adImageUrl}
                alt="Advertisement"
                className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80  object-contain "
              />
            </div>

            {/* Ad Content */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                {adTitle}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {adDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleVisitAd}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-5 h-5" />
                  Visit Site
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-base font-semibold rounded-lg transition-all duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupAds;
