"use client";

import { useState, useEffect } from "react";
import AdsBanner from "./AdsBanner";
import PopupAds from "./PopupAds";

interface ShuffledAdsProps {
  adUrl?: string;
  showInterval?: number; // in milliseconds, default 4 minutes
}

const ShuffledAds = ({
  adUrl = "https://www.rentville.ng",
  showInterval = 4 * 60 * 1000, // 4 minutes in milliseconds
}: ShuffledAdsProps) => {
  const [currentAdType, setCurrentAdType] = useState<"banner" | "popup">(
    "popup"
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // First ad (popup) shows after 2 minutes
    const initialTimeout = setTimeout(() => {
      setCurrentAdType("popup");
      setIsVisible(true);
      setIsDismissed(false);
    }, 2 * 60 * 1000); // 2 minutes

    // Set up interval to switch between ad types every 4 minutes after the first ad
    const interval = setInterval(() => {
      setCurrentAdType((prev) => (prev === "banner" ? "popup" : "banner"));
      setIsVisible(true);
      setIsDismissed(false);
    }, showInterval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [showInterval]);

  // Handle ad dismissal
  const handleAdDismissed = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  // Banner ad configuration
  const bannerConfig = {
    adUrl,
    adTitle: "Turn Vacant Homes Into ₦50K+ Instantly!",
    adDescription:
      "List empty apartments or moving-out spaces on Rentville and start cashing out today.",
    adImageUrl: "/rentville2.png",
    showInterval: showInterval,
    isVisible: isVisible && currentAdType === "banner" && !isDismissed,
    onDismiss: handleAdDismissed,
  };

  // Popup ad configuration
  const popupConfig = {
    adUrl,
    adTitle: "Earn ₦50K+ From That Empty Apartment!",
    adDescription:
      "Whether it's a vacant flat nearby or your own place, Rentville helps you connect directly with renters and make quick money.",
    adImageUrl: "/rentville.png",
    showInterval: showInterval,
    isVisible: isVisible && currentAdType === "popup" && !isDismissed,
    onDismiss: handleAdDismissed,
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {currentAdType === "banner" ? (
        <AdsBanner {...bannerConfig} />
      ) : (
        <PopupAds {...popupConfig} />
      )}
    </>
  );
};

export default ShuffledAds;
