/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from "react";
import { Download, Share2, Eye } from "lucide-react";

interface MediaItem {
  id: string;
  eventId: string;
  uploadedBy: string;
  mediaType: string;
  mediaUrl: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  cloudinaryPublicId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  uploader: {
    id: string;
    fullname: string;
  };
}
export const MediaActionsMenu = ({
  media,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onPreview,
}: {
  media: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onPreview: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-12 right-0  bg-zinc-800/95 backdrop-blur-lg border border-zinc-700/50 rounded-xl shadow-2xl py-2 min-h-20 min-w-40 z-50"
    >
      <button
        onClick={onPreview}
        className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700/50 transition-colors flex items-center gap-3"
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
      <button
        onClick={onDownload}
        className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700/50 transition-colors flex items-center gap-3"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
      <button
        onClick={onShare}
        className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700/50 transition-colors flex items-center gap-3"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
};
