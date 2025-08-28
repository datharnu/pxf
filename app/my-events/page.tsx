"use client";

import { Suspense, useEffect, useState } from "react";
import { getUserEvents, ApiError, deleteEvent } from "../utils/api";
import { CreateEventResponse } from "../../types/event";
import { isAuthenticated } from "../utils/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import {
  Edit3,
  Share2,
  QrCode,
  Image as ImageIcon,
  Trash,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Extract the component that uses useSearchParams into a separate component
function MyEventsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<CreateEventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      // Check authentication first
      if (!isAuthenticated()) {
        router.push("/sign-in");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching user events...");
        const userEvents = await getUserEvents();
        console.log("User events received:", userEvents);
        console.log("Type of userEvents:", typeof userEvents);
        console.log("Is Array?", Array.isArray(userEvents));

        // Ensure we have an array
        const eventsArray = Array.isArray(userEvents) ? userEvents : [];
        setEvents(eventsArray);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const deleteMutation = useMutation({
    mutationKey: ["deleteEvent"],
    mutationFn: async (eventId: string) => {
      return await deleteEvent(eventId);
    },
    onSuccess: (_, eventId) => {
      // Remove the deleted event from the local state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      toast("Success", {
        description: "Event deleted successfully!",
        style: { backgroundColor: "#22c55e", color: "white" },
      });

      // Invalidate queries to refetch data if needed
      queryClient.invalidateQueries({ queryKey: ["userEvents"] });
    },
    onError: (error: Error) => {
      toast("Error", {
        description: error.message || "Failed to delete event",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    },
  });

  const handleDeleteEvent = (eventId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate(eventId);
    }
  };

  const copyToClipboard = async (url: string, eventId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(eventId);
      setTimeout(() => setCopiedUrl(null), 2000);
      toast("Success", {
        description: "Access URL copied to clipboard!",
        style: { backgroundColor: "#22c55e", color: "white" },
      });
    } catch {
      toast("Error", {
        description: "Failed to copy to clipboard",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    }
  };

  const shareEvent = async (eventSlug: string, eventTitle: string) => {
    const url = `${window.location.origin}/event/${eventSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Join my event: ${eventTitle}`,
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        copyToClipboard(url, eventSlug);
      }
    } else {
      copyToClipboard(url, eventSlug);
    }
  };

  // const openEventUrl = (eventSlug: string) => {
  //   const url = `${window.location.origin}/event/${eventSlug}`;
  //   window.open(url, "_blank");
  // };

  // const formatEventDate = (dateString: string | null) => {
  //   if (!dateString) return "No date set";
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     weekday: "short",
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  const shortenDescription = (description: string, maxWords: number = 8) => {
    if (!description) return "";
    const words = description.split(" ");
    if (words.length <= maxWords) return description;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const downloadQRCode = (qrCodeData: string, eventTitle: string) => {
    if (!qrCodeData) {
      toast("Error", {
        description: "QR code not available",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = qrCodeData;
      link.download = `${eventTitle || "event"}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast("Success", {
        description: "QR code downloaded!",
        style: { backgroundColor: "#22c55e", color: "white" },
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast("Error", {
        description: "Failed to download QR code",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        {/* <Navbar /> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-400 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-400 rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-500 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-500 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-500 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="pt-4 px-3">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-white">Cameras</h1>
            <div className="flex items-center gap-3 bg-[#353935] py-2 px-3 rounded-full">
              <ScanLine className="w-4 h-4 text-white " />
              <span className="text-white font-semibold"> Join</span>
            </div>
          </div>
          <p className="text-gray-400 font-bold  mt-2">
            {/* Manage and share your created events */}
            Hosting
          </p>
        </div>

        {!Array.isArray(events) || events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[#919191] text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-[#919191] mb-6">
              Create your first event to get started
            </p>
            <Button
              onClick={() => router.push("/create-event")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Create Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <div
                key={event.id}
                className=" flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Event Image */}
                <div className="">
                  {event.eventFlyer ? (
                    <Image
                      src={event.eventFlyer}
                      alt="event-flyer"
                      width={100}
                      height={100}
                      className="object-cover rounded-sm h-20  w-12 md:w-40 "
                    />
                  ) : (
                    <div className="w-12 h-20 bg-gray-100 rounded-sm flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="">
                  <div className="flex items-center justify-between gap-5 mt-">
                    <h3 className="text-sm font-bold text-white  line-clamp-2">
                      {event.title}
                    </h3>
                    {/* {event.isPasswordProtected && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        🔒
                      </span>
                    )} */}
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-400 hover:text-red-600 disabled:opacity-50"
                      title="Delete Event"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[#919191] font-semibold text-xs mb-4 line-clamp-2">
                    {shortenDescription(event.description || "")}
                  </p>

                  {/* Event Details */}
                  {/* <div className="space-y-2 mb-4 flex flex-col">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      <span>{event.guestLimit || "N/A"} guests</span>
                    </div>
                  </div> */}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-5 ">
                    <div className="bg-[#353935] px-6 rounded-full py-2 ">
                      <button className="flex items-center text-sm text-white cursor-pointer">
                        <ImageIcon className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="bg-[#353935] px-6 py-2 rounded-full">
                      <button
                        onClick={() => router.push(`/edit-event/${event.id}`)}
                        className="text-white flex items-center cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="bg-[#353935] px-6 py-2 rounded-full">
                      <button
                        onClick={() => shareEvent(event.eventSlug, event.title)}
                        className="text-white flex items-center cursor-pointer"
                        title="Share Event"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>

                    {event.qrCodeData && (
                      <div className="bg-[#353935] px-6 py-2 rounded-full">
                        <button
                          onClick={() => setShowQRCode(event.id)}
                          className="text-white flex items-center cursor-pointer"
                          title="Show QR Code"
                        >
                          <QrCode className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Modal */}
                {showQRCode === event.id && event.qrCodeData && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                      <h3 className="text-lg font-bold mb-4 text-center">
                        Event QR Code
                      </h3>
                      <div className="flex justify-center mb-4">
                        <img
                          src={event.qrCodeData}
                          alt="Event QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                      <div className="flex justify-center gap-3">
                        <Button
                          onClick={() =>
                            downloadQRCode(event.qrCodeData, event.title)
                          }
                          variant="outline"
                          size="sm"
                        >
                          Download
                        </Button>
                        <Button
                          onClick={() => setShowQRCode(null)}
                          variant="default"
                          size="sm"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create New Event Button */}
        {events.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => router.push("/create-event")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Create New Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component to show while Suspense is resolving
function MyEventsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyEvents() {
  return (
    <Suspense fallback={<MyEventsLoading />}>
      <MyEventsContent />
    </Suspense>
  );
}
