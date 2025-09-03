/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Download, Share2, Eye, Trash2, X } from "lucide-react";
import { api } from "@/api/axios";
import { toast } from "sonner";

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
  onDeleteSuccess,
}: {
  media: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onPreview: () => void;
  onDeleteSuccess?: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, showDeleteConfirm]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/media/${media.id}`);

      if (response.data.success) {
        toast.success("Media deleted successfully");
        onDeleteSuccess?.();
      } else {
        throw new Error(response.data.message || "Failed to delete media");
      }
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast.error(error.response?.data?.message || "Failed to delete media");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  // Mobile overlay for better UX on small screens
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        ref={menuRef}
        className={`
          absolute z-70 bg-zinc-900/95 backdrop-blur-lg border border-zinc-700/50 rounded-xl shadow-2xl
          ${
            isMobile
              ? "fixed bottom-4 left-4 right-4 top-auto"
              : "top-12 right-0 min-w-48"
          }
        `}
      >
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
            <h3 className="text-zinc-200 font-medium">Media Actions</h3>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {!showDeleteConfirm ? (
          <div className={`${isMobile ? "p-2" : "py-2"}`}>
            <button
              onClick={() => {
                onPreview();
                onClose();
              }}
              className={`
                w-full text-left text-zinc-200 hover:bg-zinc-700/50 transition-colors 
                flex items-center gap-3
                ${isMobile ? "px-4 py-3 text-base" : "px-4 py-2 text-sm"}
              `}
            >
              <Eye className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
              Preview
            </button>

            <button
              onClick={() => {
                onDownload();
                onClose();
              }}
              className={`
                w-full text-left text-zinc-200 hover:bg-zinc-700/50 transition-colors 
                flex items-center gap-3
                ${isMobile ? "px-4 py-3 text-base" : "px-4 py-2 text-sm"}
              `}
            >
              <Download className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
              Download
            </button>

            <button
              onClick={() => {
                onShare();
                onClose();
              }}
              className={`
                w-full text-left text-zinc-200 hover:bg-zinc-700/50 transition-colors 
                flex items-center gap-3
                ${isMobile ? "px-4 py-3 text-base" : "px-4 py-2 text-sm"}
              `}
            >
              <Share2 className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
              Share
            </button>

            <div
              className={`${
                isMobile ? "mx-4" : "mx-2"
              } my-1 border-t border-zinc-700/50`}
            />

            <button
              onClick={handleDeleteClick}
              className={`
                w-full text-left text-red-300 hover:bg-red-500/20 transition-colors 
                flex items-center gap-3
                ${isMobile ? "px-4 py-3 text-base" : "px-4 py-2 text-sm"}
              `}
            >
              <Trash2 className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
              Delete
            </button>
          </div>
        ) : (
          <div className={`${isMobile ? "p-4" : "p-4"}`}>
            <div className="mb-4">
              <h4
                className={`text-zinc-200 font-medium mb-2 ${
                  isMobile ? "text-base" : "text-sm"
                }`}
              >
                Delete Media
              </h4>
              <p
                className={`text-zinc-400 ${isMobile ? "text-sm" : "text-xs"}`}
              >
                Are you sure you want to delete &quot;{media.fileName}&quot;?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className={`
                  flex-1 px-3 py-2 text-zinc-300 bg-zinc-700/50 hover:bg-zinc-600/50 
                  transition-colors rounded-lg disabled:opacity-50
                  ${isMobile ? "text-sm py-3" : "text-xs"}
                `}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`
                  flex-1 px-3 py-2 text-white bg-red-600 hover:bg-red-700 
                  transition-colors rounded-lg disabled:opacity-50 flex items-center justify-center gap-2
                  ${isMobile ? "text-sm py-3" : "text-xs"}
                `}
              >
                {isDeleting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
