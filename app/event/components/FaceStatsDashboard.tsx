/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  Activity,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { getFaceStats, retrainFaceIdentification } from "@/app/utils/faceApi";
import { FaceStatsDashboardProps } from "@/types/face";

interface FaceStats {
  totalFaceDetections: number;
  identifiedFaces: number;
  totalFaceProfiles: number;
  trainingStatus: string;
}

export const FaceStatsDashboard: React.FC<FaceStatsDashboardProps> = ({
  eventId,
}) => {
  const [stats, setStats] = useState<FaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [retraining, setRetraining] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getFaceStats(eventId);

      if (result.success) {
        setStats(result.stats);
      } else {
        throw new Error(result.message || "Failed to load face statistics");
      }
    } catch (error: unknown) {
      console.error("Failed to load face stats:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load face statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    try {
      setRetraining(true);
      const result = await retrainFaceIdentification(eventId);

      if (result.success) {
        toast.success("Face identification retraining started");
        // Reload stats after a brief delay
        setTimeout(() => {
          loadStats();
        }, 2000);
      } else {
        throw new Error(
          result.message || "Failed to retrain face identification"
        );
      }
    } catch (error: unknown) {
      console.error("Failed to retrain face identification:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to retrain face identification"
      );
    } finally {
      setRetraining(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [eventId]);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-zinc-300">Loading face statistics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-2">
            Error Loading Statistics
          </h3>
          <p className="text-sm text-zinc-400 mb-4">{error}</p>
          <Button
            onClick={loadStats}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-zinc-700/50 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-2">
            No Face Statistics Available
          </h3>
          <p className="text-sm text-zinc-400">
            Face detection statistics will appear here once photos are uploaded
            and processed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const identificationRate =
    stats.totalFaceDetections > 0
      ? (stats.identifiedFaces / stats.totalFaceDetections) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">
          Face Detection Analytics
        </h2>
        <p className="text-zinc-400">
          Real-time statistics for face detection and identification
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Face Detections */}
        <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Detections</p>
                <p className="text-2xl font-bold text-zinc-50">
                  {stats.totalFaceDetections}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identified Faces */}
        <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Identified Faces</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.identifiedFaces}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Face Profiles */}
        <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Face Profiles</p>
                <p className="text-2xl font-bold text-amber-400">
                  {stats.totalFaceProfiles}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identification Rate */}
        <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {identificationRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Status */}
      <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Training Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-zinc-200 font-medium">System Status</p>
              <p className="text-sm text-zinc-400">{stats.trainingStatus}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={loadStats}
              variant="outline"
              className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-700/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Stats
            </Button>

            <Button
              onClick={handleRetrain}
              disabled={retraining}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-semibold"
            >
              {retraining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retraining...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Retrain System
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-700/50">
        <CardHeader>
          <CardTitle className="text-zinc-50">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-800/30 rounded-lg">
              <h4 className="text-zinc-200 font-medium mb-2">
                Detection Efficiency
              </h4>
              <p className="text-sm text-zinc-400">
                {stats.totalFaceDetections > 0
                  ? `${stats.totalFaceDetections} faces detected across all uploaded media`
                  : "No faces detected yet"}
              </p>
            </div>

            <div className="p-4 bg-zinc-800/30 rounded-lg">
              <h4 className="text-zinc-200 font-medium mb-2">
                User Engagement
              </h4>
              <p className="text-sm text-zinc-400">
                {stats.totalFaceProfiles} user
                {stats.totalFaceProfiles !== 1 ? "s have" : " has"} enrolled
                their face{stats.totalFaceProfiles !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {identificationRate < 50 && stats.totalFaceDetections > 0 && (
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h4 className="text-amber-300 font-medium">
                  Low Identification Rate
                </h4>
              </div>
              <p className="text-sm text-amber-200">
                Consider retraining the face identification system to improve
                accuracy. Current success rate is{" "}
                {identificationRate.toFixed(1)}%.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
