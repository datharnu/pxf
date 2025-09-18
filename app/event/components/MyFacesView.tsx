/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Loader2,
  AlertCircle,
  Sparkles,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getMyFaces } from "@/app/utils/faceApi";
import {
  MyFacesViewProps,
  FaceMatchResult,
  FaceMatchSummary,
} from "@/types/face";
import { FaceEnrollment } from "./FaceEnrollment";
import { FaceStatus } from "./FaceStatus";

interface MyFacesData {
  userId: string;
  matches: FaceMatchResult[];
  summary: FaceMatchSummary;
}

export const MyFacesView: React.FC<MyFacesViewProps> = ({ eventId }) => {
  const [media, setMedia] = useState<FaceMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [similarityThreshold, setSimilarityThreshold] = useState(0.8);
  const [summary, setSummary] = useState<FaceMatchSummary | null>(null);
  const [hasFaceProfile, setHasFaceProfile] = useState<boolean | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<FaceMatchResult | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const loadMyFaces = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getMyFaces(eventId, similarityThreshold);

      if (result.success) {
        setMedia(result.data.matches);
        setSummary(result.data.summary);
        setHasFaceProfile(true);
      } else {
        throw new Error(
          result.message || "Failed to load photos with your face"
        );
      }
    } catch (error: any) {
      console.error("Failed to load my faces:", error);
      setError(error.message || "Failed to load photos with your face");

      // Check if it's because no face profile exists
      if (
        error.message?.includes("face profile") ||
        error.message?.includes("not enrolled")
      ) {
        setHasFaceProfile(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (media: FaceMatchResult, index: number) => {
    setSelectedMedia(media);
    setPreviewIndex(index);
    setShowPreview(true);
  };

  const handleDownload = async (media: FaceMatchResult) => {
    try {
      toast.loading("Preparing download...");

      const response = await fetch(media.mediaUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = media.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Download started!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download file");
    }
  };

  const handleShare = async (media: FaceMatchResult) => {
    try {
      if (navigator.share) {
        const response = await fetch(media.mediaUrl);
        const blob = await response.blob();
        const file = new File([blob], media.fileName, {
          type: media.mediaType.startsWith("video/")
            ? "video/mp4"
            : "image/jpeg",
        });

        await navigator.share({
          files: [file],
          title: media.fileName,
          text: `Check out this photo from the event!`,
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(media.mediaUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  const goToPrevious = () => {
    if (previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
      setSelectedMedia(media[previewIndex - 1]);
    }
  };

  const goToNext = () => {
    if (previewIndex < media.length - 1) {
      setPreviewIndex(previewIndex + 1);
      setSelectedMedia(media[previewIndex + 1]);
    }
  };

  useEffect(() => {
    loadMyFaces();
  }, [eventId]);

  // If no face profile exists, show enrollment
  if (hasFaceProfile === false) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-50 mb-2">My PXF</h2>
          <p className="text-zinc-400">Photos with Your Face</p>
        </div>
        <FaceStatus eventId={eventId} onStatusChange={setHasFaceProfile} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">My PXF</h2>
        <p className="text-zinc-400">
          Photos with Your Face ({summary?.totalMatches || 0} found)
        </p>
      </div>

      {/* Similarity Threshold Slider */}
      <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-zinc-300">
              Similarity Threshold: {(similarityThreshold * 100).toFixed(0)}%
            </label>
            <Button
              onClick={loadMyFaces}
              disabled={loading}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </Button>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.1"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>50% (More Results)</span>
            <span>100% (Exact Match)</span>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="ml-3 text-zinc-300">Loading your photos...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">
              Error Loading Photos
            </h3>
            <p className="text-sm text-zinc-400 mb-4">{error}</p>
            <Button
              onClick={() => loadMyFaces()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && media.length === 0 && (
        <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-700/50 rounded-2xl flex items-center justify-center">
              <Camera className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">
              No Photos Found
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              No photos with your face have been detected yet. Make sure
              you&apos;ve enrolled your face and that photos are being uploaded
              to the event.
            </p>
            <Button
              onClick={() => loadMyFaces()}
              variant="outline"
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-700/50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Media Grid */}
      {!loading && !error && media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item, index) => (
            <div
              key={item.mediaId}
              className="group relative aspect-square bg-zinc-800/30 rounded-xl overflow-hidden border border-zinc-700/30 hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
              onClick={() => handlePreview(item, index)}
            >
              {/* Media Content */}
              {item.mediaType.startsWith("video/") ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full p-1">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.mediaUrl}
                  alt={item.fileName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Face Detection Overlays */}
              {item.matchedFaces.map((match, idx) => (
                <div
                  key={idx}
                  className="absolute bg-blue-500 bg-opacity-50 border border-blue-400 rounded"
                  style={{
                    left: `${match.faceRectangle.left}px`,
                    top: `${match.faceRectangle.top}px`,
                    width: `${match.faceRectangle.width}px`,
                    height: `${match.faceRectangle.height}px`,
                  }}
                >
                  <span className="absolute -top-6 left-0 text-xs text-white bg-blue-500 px-1 rounded">
                    {(match.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-medium truncate mb-1">
                    {item.fileName}
                  </p>
                  <div className="flex justify-between items-center text-xs text-zinc-300">
                    <span>{item.matchedFaces.length} face(s)</span>
                    <span>
                      {(item.overallConfidence * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Similarity:{" "}
                    {(item.matchedFaces[0]?.similarity * 100 || 0).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}
                    className="p-2 bg-zinc-900/70 backdrop-blur-sm rounded-full hover:bg-zinc-800/90 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(item);
                    }}
                    className="p-2 bg-zinc-900/70 backdrop-blur-sm rounded-full hover:bg-zinc-800/90 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {summary && (
        <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {summary.highConfidenceMatches}
                </div>
                <div className="text-xs text-zinc-400">High Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {summary.mediumConfidenceMatches}
                </div>
                <div className="text-xs text-zinc-400">Medium Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {summary.lowConfidenceMatches}
                </div>
                <div className="text-xs text-zinc-400">Low Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {showPreview && selectedMedia && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToPrevious}
            disabled={previewIndex === 0}
            className="absolute left-4 z-50 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToNext}
            disabled={previewIndex === media.length - 1}
            className="absolute right-4 z-50 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
            {selectedMedia.mediaType.startsWith("video/") ? (
              <video
                src={selectedMedia.mediaUrl}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <Image
                src={selectedMedia.mediaUrl}
                alt={selectedMedia.fileName}
                fill
                className="object-contain"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
            {previewIndex + 1} / {media.length}
          </div>
        </div>
      )}
    </div>
  );
};
