"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  User,
  Globe,
  ChevronRight,
  Camera,
  Video,
} from "lucide-react";

interface ParticipantItem {
  id: string;
  fullname: string;
  uploadsCount?: number;
  imagesCount?: number;
  videosCount?: number;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  participants?: ParticipantItem[];
  onSelectUser?: (user: ParticipantItem) => void;
  allCounts?: { photos: number; videos: number };
  myCounts?: { photos: number; videos: number };
  onOpenChooser?: () => void;
}

export function BottomNav({
  activeTab,
  onTabChange,
  participants = [],
  onSelectUser,
  allCounts,
  myCounts,
  onOpenChooser,
}: BottomNavProps) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const formatCounts = (counts?: { photos: number; videos: number }) => {
    if (!counts) return "0 items";
    const photos = counts.photos ?? 0;
    const videos = counts.videos ?? 0;
    const total = photos + videos;

    if (total === 0) return "0 items";
    if (photos === 0) return `${videos} video${videos !== 1 ? "s" : ""}`;
    if (videos === 0) return `${photos} photo${photos !== 1 ? "s" : ""}`;
    return `${total} items`;
  };

  // const formatDetailedCounts = (counts?: {
  //   photos: number;
  //   videos: number;
  // }) => {
  //   if (!counts) return { photos: 0, videos: 0 };
  //   return { photos: counts.photos ?? 0, videos: counts.videos ?? 0 };
  // };

  const getUserCounts = (user: ParticipantItem) => {
    const total =
      typeof user.uploadsCount === "number"
        ? user.uploadsCount
        : (user.imagesCount ?? 0) + (user.videosCount ?? 0);
    return total;
  };

  const handleFilterSelect = (filterValue: string) => {
    onTabChange(filterValue);
    closeDrawer();
  };

  const handleUserSelect = (user: ParticipantItem) => {
    onTabChange(`user:${user.id}`);
    if (onSelectUser) onSelectUser(user);
    closeDrawer();
  };

  const openDrawer = () => {
    setShowFilterDrawer(true);
    setIsAnimating(true);
    if (onOpenChooser) onOpenChooser();
  };

  const closeDrawer = () => {
    setIsAnimating(false);
    setTimeout(() => setShowFilterDrawer(false), 200);
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (showFilterDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFilterDrawer]);

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="flex justify-around items-center py-3 px-4">
          <button
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "all"
                ? "text-white "
                : "text-gray-400 hover:text-gray-200 "
            }`}
            onClick={() => onTabChange("all")}
          >
            <Globe className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">All</span>
            {activeTab === "all" && (
              <div className="w-1 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mt-1 animate-pulse"></div>
            )}
          </button>

          <button
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "my"
                ? "text-white "
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            }`}
            onClick={() => onTabChange("my")}
          >
            <User className="w-4 h-4 mb-1 " />
            <span className="text-xs font-medium">My Picha</span>
            {activeTab === "my" && (
              <div className="w-1 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mt-1 animate-pulse"></div>
            )}
          </button>

          <button
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "choose" || activeTab.startsWith("user:")
                ? "text-white bg-white/10"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            }`}
            onClick={openDrawer}
          >
            <Users className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">Choose Picha</span>
            {(activeTab === "choose" || activeTab.startsWith("user:")) && (
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-1 animate-pulse"></div>
            )}
          </button>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilterDrawer && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${
            isAnimating ? "bg-black/80 backdrop-blur-sm" : "bg-black/0"
          }`}
          onClick={closeDrawer}
        >
          <div
            className={`fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/10 rounded-t-3xl transform transition-all duration-300 ease-out ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-xl">
                Choose a Picha
              </h3>
              <button
                onClick={closeDrawer}
                className="text-gray-400 hover:text-white p-2 -m-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 max-h-[70vh] overflow-y-auto">
              {/* Quick Options */}
              <div className="space-y-3 mb-8">
                {/* All */}
                <button
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 group ${
                    activeTab === "all"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25"
                      : "bg-white/5 text-gray-200 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                  onClick={() => handleFilterSelect("all")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-xl ${
                          activeTab === "all" ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-medium">All Content</span>
                        <p className="text-sm opacity-75">
                          Everything from everyone
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm opacity-80">
                        {formatCounts(allCounts)}
                      </span>
                      {allCounts && (
                        <div className="flex items-center space-x-2 text-xs opacity-60 mt-1">
                          {allCounts.photos > 0 && (
                            <div className="flex items-center space-x-1">
                              <Camera className="w-3 h-3" />
                              <span>{allCounts.photos}</span>
                            </div>
                          )}
                          {allCounts.videos > 0 && (
                            <div className="flex items-center space-x-1">
                              <Video className="w-3 h-3" />
                              <span>{allCounts.videos}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* My Picha */}
                <button
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 group ${
                    activeTab === "my"
                      ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-600/25"
                      : "bg-white/5 text-gray-200 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                  onClick={() => handleFilterSelect("my")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-xl ${
                          activeTab === "my" ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-medium">My Picha</span>
                        <p className="text-sm opacity-75">
                          Your personal uploads
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm opacity-80">
                        {formatCounts(myCounts)}
                      </span>
                      {myCounts && (
                        <div className="flex items-center space-x-2 text-xs opacity-60 mt-1">
                          {myCounts.photos > 0 && (
                            <div className="flex items-center space-x-1">
                              <Camera className="w-3 h-3" />
                              <span>{myCounts.photos}</span>
                            </div>
                          )}
                          {myCounts.videos > 0 && (
                            <div className="flex items-center space-x-1">
                              <Video className="w-3 h-3" />
                              <span>{myCounts.videos}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Participants Section */}
              {participants.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Participants ({participants.length})
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {participants.map((user) => {
                      const isActive = activeTab === `user:${user.id}`;
                      const userCount = getUserCounts(user);

                      return (
                        <button
                          key={user.id}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                            isActive
                              ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-600/25"
                              : "bg-white/3 text-gray-200 hover:bg-white/8 hover:scale-[1.01] active:scale-[0.99]"
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-gradient-to-br from-gray-600 to-gray-700 text-gray-200"
                                }`}
                              >
                                {user.fullname
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium">
                                  {user.fullname}
                                </span>
                                <p className="text-sm opacity-75">
                                  {userCount} upload{userCount !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm opacity-80">
                                {userCount}
                              </span>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isActive
                                    ? "opacity-100"
                                    : "opacity-40 group-hover:opacity-70"
                                }`}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
