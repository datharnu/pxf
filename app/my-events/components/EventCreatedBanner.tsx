"use client";
import { CheckCircle, Copy, QrCode, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface EventCreatedBannerProps {
  event: {
    id: string;
    title: string;
    coverImage: string;
    description: string;
    eventCode: string;
    shareUrl: string;
    dateCreated: string;
  };
}

export default function EventCreatedBanner({ event }: EventCreatedBannerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copied, setCopied] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showBanner) return null; // Hide banner when dismissed

  return (
    <div
      className="relative rounded-2xl shadow-lg p-6 mt-8 max-w-3xl mx-auto"
      style={{
        background: `linear-gradient(to right, #F59E0B, #FBBF24, #F97316)`,
        color: "white",
      }}
    >
      {/* Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FCFCFE1A",
          borderRadius: "1rem",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Close Button */}
      <button
        className="absolute top-3 right-3 z-10 text-white hover:text-gray-300"
        onClick={() => setShowBanner(false)}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Banner Content */}
      <div
        className="flex items-center gap-3 mb-4 relative z-10"
        style={{ color: "oklch(0.145 0 0)" }}
      >
        <CheckCircle size={24} />
        <h2 className="text-xl font-semibold">Your event has been created!</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <Image
          src={event.coverImage}
          alt="Event cover"
          width={500}
          height={300}
          className="rounded-lg object-cover w-full"
        />

        <div>
          <h3 className="text-lg font-bold">{event.title}</h3>
          <p className="text-sm mb-3">{event.description}</p>

          <div className="mb-2">
            <span className="text-sm">Event Code:</span>
            <div
              className="flex items-center justify-between px-3 py-1 rounded mt-1"
              style={{ backgroundColor: "oklch(0.145 0 0 / 0.2)" }}
            >
              <span className="text-sm font-mono">{event.eventCode}</span>
              <button onClick={() => handleCopy(event.eventCode)}>
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-sm">Share Link:</span>
            <div
              className="flex items-center justify-between px-3 py-1 rounded mt-1"
              style={{ backgroundColor: "oklch(0.145 0 0 / 0.2)" }}
            >
              <span className="text-sm truncate">{event.shareUrl}</span>
              <button onClick={() => handleCopy(event.shareUrl)}>
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="default"
              onClick={() => handleCopy(event.shareUrl)}
              style={{ backgroundColor: "oklch(0.145 0 0)", color: "white" }}
            >
              Share with Friends
            </Button>
            <Button
              variant="secondary"
              style={{ borderColor: "white", color: "black" }}
            >
              <QrCode className="mr-1 h-4 w-4" />
              View QR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
