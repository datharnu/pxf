/* eslint-disable @typescript-eslint/no-unused-vars */
// Add these imports at the top with the other lucide-react imports

import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Camera,
  ArrowLeft,
  X,
  ArrowRightIcon,
  Plus,
  Images,
  Download,
  DoorClosedLocked,
  ArrowRight,
  User,
  Calendar,
  Upload,
  Grid3X3,
  List,
  MoreVertical,
  Share2,
  Check,
  Play,
  Video,
  ChevronLeft,
  ChevronRight,
  MessageCircle, // Add this import
  Link, // Add this import
} from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  mediaUrl: string;
  fileName: string;
  mimeType: string;
}

// Replace the entire ShareModal component with this improved version
export const ShareModal = ({
  isOpen,
  onClose,
  media,
}: {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
}) => {
  if (!isOpen || !media?.length) return null;

  const isVideo = (mimeType: string) => mimeType.startsWith("video/");
  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  // Helper function to download and convert media to blob
  const downloadMediaAsBlob = async (
    mediaUrl: string,
    fileName: string,
    mimeType: string
  ) => {
    try {
      const response = await fetch(mediaUrl);
      if (!response.ok) throw new Error("Failed to fetch media");

      const blob = await response.blob();
      return new File([blob], fileName, { type: mimeType });
    } catch (error) {
      console.error("Error downloading media:", error);
      throw error;
    }
  };

  // Native Web Share API (works best on mobile)
  const shareViaWebAPI = async () => {
    try {
      if (!navigator.share) {
        throw new Error("Web Share API not supported");
      }

      if (media.length === 1) {
        const mediaItem = media[0];
        toast.loading("Preparing file for sharing...");

        try {
          const file = await downloadMediaAsBlob(
            mediaItem.mediaUrl,
            mediaItem.fileName,
            mediaItem.mimeType
          );

          const shareData: ShareData = {
            files: [file],
            title: `Check out this ${
              isVideo(mediaItem.mimeType) ? "video" : "photo"
            }!`,
            text: `Amazing ${
              isVideo(mediaItem.mimeType) ? "video" : "photo"
            } from our event!`,
          };

          // Check if files can be shared
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            toast.dismiss();
            toast.success("Shared successfully!");
            onClose();
          } else {
            throw new Error("Cannot share files");
          }
        } catch (error) {
          toast.dismiss();
          // Fallback to sharing URL if file sharing fails
          await shareUrlOnly(mediaItem.mediaUrl, mediaItem.fileName);
        }
      } else {
        // For multiple items, share URLs with text
        const urls = media.map((m) => m.mediaUrl).join("\n");
        const shareData: ShareData = {
          title: `${media.length} amazing memories!`,
          text: `Check out these ${media.length} ${
            media[0].mimeType.startsWith("video/") ? "videos" : "photos"
          } from our event!\n\n${urls}`,
        };

        await navigator.share(shareData);
        toast.success("Shared successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Web Share API failed:", error);
      throw error;
    }
  };

  // Share URL only (fallback)
  const shareUrlOnly = async (url: string, fileName: string) => {
    const shareData: ShareData = {
      title: fileName,
      text: `Check out this amazing content from our event!`,
      url: url,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      toast.success("Shared successfully!");
      onClose();
    } else {
      throw new Error("Sharing not supported");
    }
  };

  // WhatsApp sharing
  const shareToWhatsApp = async () => {
    try {
      if (media.length === 1) {
        const mediaItem = media[0];
        const text = `Check out this amazing ${
          isVideo(mediaItem.mimeType) ? "video" : "photo"
        } from our event! 🎉\n\n${mediaItem.mediaUrl}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      } else {
        const text = `Check out these ${
          media.length
        } amazing memories from our event! 🎉\n\n${media
          .map((m, index) => `${index + 1}. ${m.mediaUrl}`)
          .join("\n")}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      toast.success("Opening WhatsApp...");
      onClose();
    } catch (error) {
      console.error("WhatsApp share failed:", error);
      toast.error("Failed to open WhatsApp");
    }
  };

  // Twitter/X sharing
  const shareToTwitter = async () => {
    try {
      const baseText =
        media.length === 1
          ? `Check out this amazing ${
              isVideo(media[0].mimeType) ? "video" : "photo"
            } from our event! 🎉`
          : `Check out these ${media.length} amazing memories from our event! 🎉`;

      const url = media[0].mediaUrl; // Twitter only shows one preview
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        baseText
      )}&url=${encodeURIComponent(url)}`;

      window.open(twitterUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening Twitter...");
      onClose();
    } catch (error) {
      console.error("Twitter share failed:", error);
      toast.error("Failed to open Twitter");
    }
  };

  // Facebook sharing
  const shareToFacebook = async () => {
    try {
      const url = media[0].mediaUrl; // Facebook will preview the first URL
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;

      window.open(facebookUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening Facebook...");
      onClose();
    } catch (error) {
      console.error("Facebook share failed:", error);
      toast.error("Failed to open Facebook");
    }
  };

  // Copy links to clipboard
  const copyToClipboard = async () => {
    try {
      const urls = media.map((m) => m.mediaUrl).join("\n");
      await navigator.clipboard.writeText(urls);
      toast.success(
        `Copied ${media.length > 1 ? "links" : "link"} to clipboard!`
      );
      onClose();
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy links");
    }
  };

  // Download all files
  const downloadAll = async () => {
    try {
      toast.loading(`Preparing ${media.length} downloads...`);

      // Download files with delay to prevent overwhelming the browser
      for (let i = 0; i < media.length; i++) {
        const mediaItem = media[i];

        setTimeout(async () => {
          try {
            const response = await fetch(mediaItem.mediaUrl);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = mediaItem.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error(`Failed to download ${mediaItem.fileName}:`, error);
          }
        }, i * 1000); // 1 second delay between downloads
      }

      setTimeout(() => {
        toast.dismiss();
        toast.success(`Started ${media.length} downloads!`);
      }, 1500);

      onClose();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to start downloads");
    }
  };

  // Try native share first, fallback to platform-specific sharing
  const handleNativeShare = async () => {
    try {
      await shareViaWebAPI();
    } catch (error) {
      console.log("Native sharing failed, showing platform options");
      // Don't show error - let user choose platform manually
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-t-3xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-zinc-50">
              Share {media.length > 1 ? `${media.length} items` : "item"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Native Share (if supported) */}
            {typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-4 p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-zinc-200">Quick Share</p>
                  <p className="text-sm text-zinc-400">
                    Share using device options
                  </p>
                </div>
              </button>
            )}

            {/* WhatsApp */}
            <button
              onClick={shareToWhatsApp}
              className="w-full flex items-center gap-4 p-4 bg-green-600/10 hover:bg-green-600/20 border border-green-600/20 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-200">WhatsApp</p>
                <p className="text-sm text-zinc-400">Share to WhatsApp</p>
              </div>
            </button>

            {/* Twitter */}
            <button
              onClick={shareToTwitter}
              className="w-full flex items-center gap-4 p-4 bg-sky-600/10 hover:bg-sky-600/20 border border-sky-600/20 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-200">Twitter</p>
                <p className="text-sm text-zinc-400">Share to Twitter/X</p>
              </div>
            </button>

            {/* Facebook */}
            <button
              onClick={shareToFacebook}
              className="w-full flex items-center gap-4 p-4 bg-blue-800/10 hover:bg-blue-800/20 border border-blue-800/20 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-200">Facebook</p>
                <p className="text-sm text-zinc-400">Share to Facebook</p>
              </div>
            </button>

            {/* Copy Links */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-4 p-4 bg-zinc-700/20 hover:bg-zinc-700/40 border border-zinc-700/30 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center">
                <Link className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-200">Copy Links</p>
                <p className="text-sm text-zinc-400">Copy to clipboard</p>
              </div>
            </button>

            {/* Download All */}
            <button
              onClick={downloadAll}
              className="w-full flex items-center gap-4 p-4 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/20 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-200">Download All</p>
                <p className="text-sm text-zinc-400">Save to device</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
