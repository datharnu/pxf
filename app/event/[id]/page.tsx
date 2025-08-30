/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { api } from "@/api/axios";
import EventFlyer from "../components/EventFlyer";
import { UploadModal } from "../components/UploadModal";
import { BottomNav } from "../components/BottomNav";

// Types
interface EventData {
  id: string;
  title: string;
  description: string;
  eventFlyer?: string;
  guestLimit: string;
  photoCapLimit: string;
  isPasswordProtected: boolean;
  eventDate: string;
  eventSlug: string;
  creator: {
    id: string;
    fullname: string;
    email: string;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  event?: T;
  requiresPassword?: boolean;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// EventFlyer Component
interface EventFlyerProps {
  flyer: string;
  title: string;
  date: string;
  onTakePhotos: () => void;
  onClose: () => void;
}

export default function EventSlugPage() {
  const router = useRouter();
  const params = useParams();

  // Extract the slug from the URL path
  const slug =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : "";

  console.log("Extracted slug from URL:", slug);

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState("");
  const [showFlyer, setShowFlyer] = useState(true); // New state to control flyer visibility
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // Add state for active tab
  // Single function to handle event access
  const getEventAccess = async (
    slug: string,
    password?: string
  ): Promise<ApiResponse<EventData>> => {
    try {
      console.log(`Getting event access for slug: ${slug}`);

      const response = await api.post(`/events/access/${slug}`, {
        ...(password && { password }),
      });

      console.log("Event access response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Event access error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        const errorData = error.response.data;
        return {
          success: false,
          requiresPassword: true,
          message: errorData?.message || "Event password required",
        };
      }

      if (error.response?.status === 404) {
        throw new ApiError("Event not found or inactive");
      }

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        return {
          success: false,
          requiresPassword: true,
          message: errorData?.message || "Invalid password",
        };
      }

      return {
        success: false,
        requiresPassword: false,
        message: error.response?.data?.message || "Failed to access event",
      };
    }
  };

  const processEventAccess = async (
    slug: string | any,
    password?: string
  ): Promise<{
    success: boolean;
    needsPassword: boolean;
    event?: EventData;
    message?: string;
  }> => {
    try {
      console.log("Processing event access for slug:", slug);

      const result = await getEventAccess(slug, password);

      if (result.success && result.event) {
        console.log("Event access successful");
        return {
          success: true,
          needsPassword: false,
          event: result.event,
        };
      }

      if (result.requiresPassword) {
        console.log("Password required");
        return {
          success: false,
          needsPassword: true,
          message: result.message || "Password required",
        };
      }

      console.log("Event access failed");
      return {
        success: false,
        needsPassword: false,
        message: result.message || "Failed to access event",
      };
    } catch (error: any) {
      console.error("Process Event Access Error:", error);

      return {
        success: false,
        needsPassword: false,
        message: error.message || "An error occurred while accessing the event",
      };
    }
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  useEffect(() => {
    if (slug) {
      console.log("useEffect triggered with slug:", slug);
      checkEventAccess();
    } else {
      console.log("No slug found in URL");
      setError("No event specified");
      setLoading(false);
    }
  }, [slug]);

  const checkEventAccess = async () => {
    try {
      console.log("checkEventAccess function called with slug:", slug);
      setLoading(true);
      setError("");

      const result = await processEventAccess(slug);
      console.log("processEventAccess returned:", result);

      if (result.success && result.event) {
        setEventData(result.event);
        setNeedsPassword(false);
      } else if (result.needsPassword) {
        setNeedsPassword(true);
      } else {
        setError(result.message || "Event not found");
      }
    } catch (err: any) {
      console.error("Error accessing event:", err);
      setError("Failed to load event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter the event password");
      return;
    }

    try {
      setVerifying(true);

      const result = await processEventAccess(slug, password);

      if (result.success && result.event) {
        setEventData(result.event);
        setNeedsPassword(false);
        toast.success("Access granted! Welcome to the event.");
      } else if (result.needsPassword) {
        toast.error(result.message || "Invalid password");
      } else {
        toast.error(result.message || "Failed to access event");
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error("Failed to verify password. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0"); // 01–12
    const day = String(date.getDate()).padStart(2, "0"); // 01–31
    const year = String(date.getFullYear()).slice(-2); // last 2 digits

    return `${month}.${day}.${year}`;
  };

  const navigateToCamera = () => {
    router.push(`/event/${slug}/camera`);
  };

  const navigateToGallery = () => {
    router.push(`/event/${slug}/gallery`);
  };

  const handleTakePhotos = () => {
    setShowFlyer(false);
  };

  const handleCloseFlyerOrCancel = () => {
    setShowFlyer(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading event...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Event Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Go Home
              </Button>
              <Button
                variant="outline"
                onClick={checkEventAccess}
                className="w-full"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show password form if needed
  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900/95 backdrop-blur-sm border-amber-200/20 shadow-2xl shadow-amber-500/10">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <DoorClosedLocked className="h-8 w-8 text-zinc-900" />
            </div>
            <CardTitle className="text-2xl font-semibold text-zinc-50 mb-2">
              Secure Access
            </CardTitle>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This event requires authentication. Enter your access code to
              continue.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Access code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12 h-12 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400/50 focus:ring-amber-400/20 transition-all duration-200"
                  disabled={verifying}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors duration-200 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-900 font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={verifying || !password.trim()}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>Access Event</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-900 px-3 text-zinc-500">or</span>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="w-full h-11 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Return to homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show event flyer first if event data exists and showFlyer is true
  if (eventData && showFlyer && eventData.eventFlyer) {
    return (
      <EventFlyer
        flyer={eventData.eventFlyer}
        title={eventData.title}
        date={formatDate(eventData.eventDate)}
        onTakePhotos={handleTakePhotos}
        onClose={handleCloseFlyerOrCancel}
      />
    );
  }

  // Show event details (card content) if access granted and flyer is dismissed
  // if (eventData) {
  //   return (
  //     <div className="min-h-screen bg-primary">
  //       <div className="max-w-4xl mx-auto">
  //         {/* Event Header */}
  //         <div className="">
  //           <div className="">
  //             <div className="flex flex-col md:flex-row gap-6">
  //               {/* Event Flyer Thumbnail */}
  //               {eventData.eventFlyer && (
  //                 <div className="w-full md:w-1/3">
  //                   <div
  //                     className="relative aspect-[7/4]  overflow-hidden cursor-pointer"
  //                     onClick={() => setShowFlyer(true)}
  //                   >
  //                     <Image
  //                       src={eventData.eventFlyer}
  //                       alt={eventData.title}
  //                       fill
  //                       className="object-cover hover:opacity-80 transition-opacity"
  //                     />
  //                     <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary to-transparent"></div>
  //                   </div>
  //                 </div>
  //               )}

  //               {/* Event Details */}
  //               <div className="absolute px-3">
  //                 {/* Back Button */}
  //                 <div className="mt-5">
  //                   <button
  //                     onClick={() => router.push("/")}
  //                     className="text-white hover:bg-white/10 bg-[#f0eded]/30 rounded-full p-2"
  //                   >
  //                     <ArrowLeft className="w-4 h-4 " />
  //                   </button>
  //                 </div>
  //                 <div className="mt-14 space-y-3">
  //                   <p className="text-[#dadada] font-semibold text-xs">
  //                     ENDING: {formatDate(eventData.eventDate)}
  //                   </p>
  //                   <p className=" font-bold text-lg text-white ">
  //                     {eventData.title}
  //                   </p>
  //                 </div>

  //                 <div className="flex items-center gap-2 text-xs text-[#dadada]  mt-3">
  //                   <p>0 Photos</p> . <p>2 Participants</p>
  //                 </div>
  //                 <div className="flex gap-3 items-center">
  //                   <button
  //                     className="flex items-center gap-1 mt-4 bg-[#494949] px-3 py-2 rounded-full"
  //                     onClick={handleUploadClick}
  //                   >
  //                     <Plus className="w-4 h-4 text-[#aaaaaa]" />
  //                     <span className="text-[#dadada] text-xs font-bold">
  //                       Upload
  //                     </span>
  //                   </button>
  //                   <button className="flex items-center gap-2 mt-4 bg-[#494949] px-3 py-2 rounded-full ">
  //                     <Download className="w-4 h-4 text-[#aaaaaa]" />
  //                     <span className="text-[#dadada] text-xs font-bold">
  //                       Export
  //                     </span>
  //                   </button>
  //                   <button className="flex items-center gap-2 mt-4 bg-[#494949] px-3 py-2 rounded-full ">
  //                     <Images className="w-4 h-4 text-[#aaaaaa]" />
  //                     <span className="text-[#dadada] text-xs font-bold">
  //                       Photobook
  //                     </span>
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <UploadModal
  //           isOpen={showUploadModal}
  //           onClose={() => setShowUploadModal(false)}
  //           eventData={{
  //             ...eventData,
  //             photoCapLimit: Number(eventData.photoCapLimit),
  //           }}
  //           onAddShots={navigateToCamera}
  //         />
  //         {/* Add the BottomNav component */}
  //         <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
  //       </div>
  //     </div>
  //   );
  // }

  // Added with desktop in mind first, will enhance for mobile later

  if (eventData) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="max-w-7xl mx-auto">
          {/* Event Header */}
          <div className="relative">
            {/* Mobile Layout (unchanged) */}
            <div className="block md:hidden">
              <div className="flex flex-col gap-6">
                {/* Event Flyer Thumbnail */}
                {eventData.eventFlyer && (
                  <div className="w-full">
                    <div
                      className="relative aspect-[7/4] overflow-hidden cursor-pointer"
                      onClick={() => setShowFlyer(true)}
                    >
                      <Image
                        src={eventData.eventFlyer}
                        alt={eventData.title}
                        fill
                        className="object-cover hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary to-transparent"></div>
                    </div>
                  </div>
                )}

                {/* Event Details */}
                <div className="absolute px-3">
                  {/* Back Button */}
                  <div className="mt-5">
                    <button
                      onClick={() => router.push("/")}
                      className="text-white hover:bg-white/10 bg-[#f0eded]/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-14 space-y-3">
                    <p className="text-zinc-300 font-semibold text-xs">
                      ENDING: {formatDate(eventData.eventDate)}
                    </p>
                    <p className="font-bold text-lg text-white ">
                      {eventData.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-300 mt-3">
                    <p>0 Photos</p> . <p>2 Participants</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <button
                      className="flex items-center gap-1 mt-4 bg-[#494949] backdrop-blur-sm px-3 py-2 rounded-full hover:bg-zinc-700/70 transition-all duration-200"
                      onClick={handleUploadClick}
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span className="text-[#aaaaaa] text-xs font-bold">
                        Upload
                      </span>
                    </button>
                    <button className="flex items-center gap-2 mt-4 bg-[#494949] backdrop-blur-sm px-3 py-2 rounded-full hover:bg-zinc-700/70 transition-all duration-200">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span className="text-[#aaaaaa] text-xs font-bold">
                        Export
                      </span>
                    </button>
                    <button className="flex items-center gap-2 mt-4 bg-[#494949] backdrop-blur-sm px-3 py-2 rounded-full hover:bg-zinc-700/70 transition-all duration-200">
                      <Images className="w-4 h-4 text-amber-400" />
                      <span className="text-[#aaaaaa] text-xs font-bold">
                        Photobook
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tablet & Desktop Layout */}
            <div className="hidden md:block ">
              <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                {/* Event Flyer */}
                {eventData.eventFlyer && (
                  <div className="w-full lg:w-2/5 xl:w-1/3">
                    <div
                      className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-amber-500/10"
                      onClick={() => setShowFlyer(true)}
                    >
                      <Image
                        src={eventData.eventFlyer}
                        alt={eventData.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-zinc-900/70 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Upload className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Details */}
                <div className="flex-1 space-y-6 mb-20">
                  {/* Back Button */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => router.push("/")}
                      className="text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 backdrop-blur-sm rounded-xl p-3 transition-all duration-200 hover:bg-zinc-700/50 group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    </button>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full border border-amber-500/30">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-amber-300 text-sm font-medium">
                        Active Event
                      </span>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-amber-400 font-semibold text-sm mb-2">
                        ENDING: {formatDate(eventData.eventDate)}
                      </p>
                      <h1 className="font-bold text-3xl lg:text-4xl text-zinc-50 leading-tight">
                        {eventData.title}
                      </h1>
                    </div>

                    {/* Event Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-zinc-300 font-medium">
                            {formatDate(eventData.eventDate)}
                          </p>
                          <p className="text-zinc-500 text-xs">Event Date</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-zinc-300 font-medium">
                            {eventData.creator.fullname}
                          </p>
                          <p className="text-zinc-500 text-xs">Event Host</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                          <Camera className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-zinc-300 font-medium">
                            {eventData.photoCapLimit} photos
                          </p>
                          <p className="text-zinc-500 text-xs">Per Person</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-zinc-300">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-zinc-50">0</p>
                        <p className="text-xs text-zinc-400">Photos</p>
                      </div>
                      <div className="w-px h-8 bg-zinc-700"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-zinc-50">2</p>
                        <p className="text-xs text-zinc-400">Participants</p>
                      </div>
                    </div>

                    {/* Description */}
                    {eventData.description && (
                      <div className="p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700/30">
                        <p className="text-zinc-300 leading-relaxed">
                          {eventData.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-3 rounded-xl text-zinc-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                      onClick={handleUploadClick}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Upload Photos</span>
                    </button>

                    <button className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm px-6 py-3 rounded-xl text-zinc-200 font-medium border border-zinc-700/50 transition-all duration-200 hover:border-zinc-600/50">
                      <Download className="w-5 h-5 text-amber-400" />
                      <span>Export All</span>
                    </button>

                    <button className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur-sm px-6 py-3 rounded-xl text-zinc-200 font-medium border border-zinc-700/50 transition-all duration-200 hover:border-zinc-600/50">
                      <Images className="w-5 h-5 text-amber-400" />
                      <span>Create Photobook</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <UploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            eventData={{
              ...eventData,
              photoCapLimit: Number(eventData.photoCapLimit),
            }}
            onAddShots={navigateToCamera}
          />
          {/* Add the BottomNav component */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    );
  }

  return null;
}
