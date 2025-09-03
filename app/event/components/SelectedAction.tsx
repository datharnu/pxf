import { Download, Share2, X } from "lucide-react";

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
export const SelectionActions = ({
  selectedMedia,
  onDownload,
  onShare,
  onClearSelection,
}: {
  selectedMedia: MediaItem[];
  onDownload: () => void;
  onShare: () => void;
  onClearSelection: () => void;
}) => {
  if (selectedMedia.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-4 mx-2 md:mx-0 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-auto z-50">
      <div className="bg-zinc-900/95 backdrop-blur-lg border border-zinc-700/50 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full  font-bold flex items-center justify-center">
              {selectedMedia.length}
            </div>
            <span className="text-zinc-200  font-medium md:text-[16px] text-xs ">
              selected
            </span>
          </div>

          <div className="flex items-center gap-2 md:text-[16px] text-xs">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl text-zinc-900 font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-zinc-200 font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={onClearSelection}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
