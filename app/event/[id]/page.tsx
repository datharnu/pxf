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
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { api } from "@/api/axios";
import EventFlyer from "../components/EventFlyer";

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

// function EventFlyer({
//   flyer,
//   title,
//   date,
//   onTakePhotos,
//   onClose,
// }: EventFlyerProps) {
//   return (
//     <div className="fixed inset-0 z-50 bg-black">
//       {/* Close Button */}
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
//       >
//         <X className="w-6 h-6" />
//       </button>

//       {/* Background Image */}
//       <div className="relative w-full h-full">
//         <Image
//           src={flyer}
//           alt="Event Flyer"
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
//       </div>

//       {/* Content Overlay */}
//       <div className="absolute bottom-20 left-0 right-0">
//         <div className="space-y-5">
//           <div className="flex flex-col items-center gap-2">
//             <h1 className="text-white font-bold text-3xl text-center px-4">
//               {title}
//             </h1>
//             <p className="text-[#aaaaaa] font-semibold">{date}</p>
//           </div>

//           <button
//             onClick={onTakePhotos}
//             className="bg-white text-black font-semibold px-4 py-3.5 mx-5 justify-center rounded-lg flex items-center gap-2 w-auto"
//           >
//             Take Photos
//             <ArrowRightIcon className="size-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

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
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Password Required</CardTitle>
            <p className="text-sm text-gray-600">
              This event is password protected. Please enter the password to
              continue.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter event password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  disabled={verifying}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={verifying}>
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Event"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => router.push("/")}
                className="text-sm text-gray-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Go back to home
              </Button>
            </div>
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
  if (eventData) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="">
            <div className="">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Event Flyer Thumbnail */}
                {eventData.eventFlyer && (
                  <div className="w-full md:w-1/3">
                    <div
                      className="relative aspect-[7/4]  overflow-hidden cursor-pointer"
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
                      className="text-white hover:bg-white/10 bg-white/40 rounded-full p-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </button>
                  </div>
                  <div className="mt-20 space-y-[4px]">
                    <p className="text-[#dadada] font-semibold text-xs">
                      ENDING: {formatDate(eventData.eventDate)}
                    </p>
                    <p className=" font-bold text-sm text-white ">
                      {eventData.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#dadada]  mt-[4px]">
                    {/* <p>
                      <strong>Host:</strong> {eventData.creator.fullname}
                    </p> */}
                    {/* <p>
                      <strong>Guest Limit:</strong> {eventData.guestLimit}{" "}
                      people
                    </p>
                    <p>
                      <strong>Photo Cap:</strong> {eventData.photoCapLimit}{" "}
                      photos per person
                    </p> */}
                    <p>0 Photos</p> . <p>2 Participants</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <button className="flex items-center gap-1 mt-4 bg-[#494949] px-3 py-2 rounded-full ">
                      <Plus className="w-4 h-4 text-[#aaaaaa]" />
                      <span className="text-[#dadada] text-xs font-bold">
                        Upload
                      </span>
                    </button>
                    <button className="flex items-center gap-2 mt-4 bg-[#494949] px-3 py-2 rounded-full ">
                      <Images className="w-4 h-4 text-[#aaaaaa]" />
                      <span className="text-[#dadada] text-xs font-bold">
                        Photobook
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Access Section */}
        </div>
      </div>
    );
  }

  return null;
}
