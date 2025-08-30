/* eslint-disable @typescript-eslint/no-unused-vars */
// components/UploadModal.tsx
import { Button } from "@/components/ui/button";
import { Upload, X, Calendar, User, Camera } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: {
    id: string;
    title: string;
    description?: string;
    eventDate: string;
    photoCapLimit: number;
    creator: {
      fullname: string;
    };
  };
  onAddShots: () => void;
}

export function UploadModal({
  isOpen,
  onClose,
  eventData,
  onAddShots,
}: UploadModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full shadow-2xl shadow-amber-500/10 border border-zinc-800/50 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-b border-zinc-800/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors duration-200 p-1 hover:bg-zinc-800/50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pr-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Camera className="h-6 w-6 text-zinc-900" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-50 mb-2">
              {eventData.title}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <p className="text-sm text-amber-300 font-medium">
                {eventData.photoCapLimit} photos per person
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-8 h-8 bg-zinc-800/50 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <span>{formatDate(eventData.eventDate)}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-8 h-8 bg-zinc-800/50 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-amber-400" />
              </div>
              <span>Hosted by {eventData.creator.fullname}</span>
            </div>
          </div>

          {/* Description */}
          {eventData.description && (
            <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {eventData.description}
              </p>
            </div>
          )}

          {/* Guidelines */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Upload className="w-3 h-3 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-300 mb-1">
                  Upload Guidelines
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  You can upload up to {eventData.photoCapLimit} photos to this
                  event. Make sure your photos follow the event guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 space-y-3">
          <Button
            onClick={onAddShots}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="w-5 h-5 mr-2" />
            Add Your Shots
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full h-10 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
