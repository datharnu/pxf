"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { getUserFaceProfile, deleteUserFaceProfile } from "@/app/utils/faceApi";
import { FaceStatusProps, UserFaceProfile } from "@/types/face";
import { FaceEnrollment } from "./FaceEnrollment";

export const FaceStatus: React.FC<FaceStatusProps> = ({
  eventId,
  onStatusChange,
}) => {
  const [profile, setProfile] = useState<UserFaceProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const checkFaceProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getUserFaceProfile(eventId);

      if (result.success && result.faceProfile) {
        setProfile(result.faceProfile);
        onStatusChange?.(true);
      } else {
        setProfile(null);
        onStatusChange?.(false);
      }
    } catch (error: any) {
      console.error("Failed to check face profile:", error);
      setError(error.message || "Failed to check face profile");
      setProfile(null);
      onStatusChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profile) return;

    try {
      setDeleting(true);
      const result = await deleteUserFaceProfile(eventId);

      if (result.success) {
        toast.success("Face profile deleted successfully");
        setProfile(null);
        onStatusChange?.(false);
      } else {
        throw new Error(result.message || "Failed to delete face profile");
      }
    } catch (error: any) {
      console.error("Failed to delete face profile:", error);
      toast.error(error.message || "Failed to delete face profile");
    } finally {
      setDeleting(false);
    }
  };

  const handleEnrolled = (result: any) => {
    if (result.success && result.faceProfile) {
      setProfile(result.faceProfile);
      setShowEnrollment(false);
      onStatusChange?.(true);
    }
  };

  useEffect(() => {
    checkFaceProfile();
  }, [eventId]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-zinc-300">Checking face profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showEnrollment) {
    return <FaceEnrollment eventId={eventId} onEnrolled={handleEnrolled} />;
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-md mx-auto bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-zinc-700/50 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-zinc-400" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">
              No Face Profile
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Enroll your face to automatically find photos with you in them.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => setShowEnrollment(true)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Enroll Face
            </Button>
            <Button
              onClick={checkFaceProfile}
              variant="outline"
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-700/50"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-200">
              Face Enrolled
            </h3>
            <p className="text-sm text-zinc-400">
              Your face is registered for this event
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Confidence</span>
            <span className="text-sm font-medium text-zinc-200">
              {(profile.enrollmentConfidence * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Enrolled</span>
            <span className="text-sm text-zinc-300">
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Face attributes removed for Azure Face API compatibility */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Status</span>
            <span className="text-sm text-zinc-300">
              Face enrolled successfully
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={checkFaceProfile}
            variant="outline"
            className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-700/50"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={handleDeleteProfile}
            variant="outline"
            className="border-red-500/50 text-red-300 hover:bg-red-500/20"
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-300">
              Face detection is active
            </span>
          </div>
          <p className="text-xs text-green-400 mt-1">
            You can now find photos with your face in the "My PXF" tab.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
