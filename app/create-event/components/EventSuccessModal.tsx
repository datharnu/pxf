"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Download, Check } from "lucide-react";
import { toast } from "sonner";

interface EventSuccessModalProps {
  eventData: {
    id: string;
    title: string;
    description: string;
    eventDate: string | null;
    eventSlug: string;
    qrCodeData: string;
    isPasswordProtected: boolean;
    accessPassword?: string | null;
    guestLimit: string;
    photoCapLimit: string;
    eventFlyer?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
}

export default function EventSuccessModal({
  eventData,
  isOpen,
  onClose,
  isEdit = false,
}: EventSuccessModalProps) {
  const router = useRouter();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [qrCodeLoading, setQrCodeLoading] = useState(false);

  // Generate event URL
  const eventUrl = eventData.eventSlug
    ? `${window.location.origin}/event/${eventData.eventSlug}`
    : `${window.location.origin}/event/${eventData.id}`;

  // Handle QR Code from backend
  useEffect(() => {
    const handleQRCode = async () => {
      if (!isOpen) return;

      setQrCodeLoading(true);

      try {
        // Check if we have valid QR code data from backend
        if (eventData.qrCodeData) {
          console.log("Using backend QR code data:", eventData.qrCodeData);
          setQrCodeDataUrl(eventData.qrCodeData);
          setQrCodeLoading(false);
          return;
        }

        // If no QR code from backend, generate a fallback
        console.log("No QR code from backend, generating fallback");
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          eventUrl
        )}`;
        setQrCodeDataUrl(fallbackUrl);
      } catch (error) {
        console.error("Failed to handle QR code:", error);
        // Final fallback to Google Charts API
        const googleChartsUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(
          eventUrl
        )}`;
        setQrCodeDataUrl(googleChartsUrl);
      } finally {
        setQrCodeLoading(false);
      }
    };

    handleQRCode();
  }, [eventUrl, eventData.qrCodeData, isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, type: "url" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
        toast("Success", {
          description: "Access URL copied to clipboard!",
          style: { backgroundColor: "#22c55e", color: "white" },
        });
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
        toast("Success", {
          description: "Password copied to clipboard!",
          style: { backgroundColor: "#22c55e", color: "white" },
        });
      }
    } catch {
      toast("Error", {
        description: "Failed to copy to clipboard",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    }
  };

  const downloadQRCode = async () => {
    if (!qrCodeDataUrl) {
      toast("Error", {
        description: "QR code not available",
        style: { backgroundColor: "#dc2626", color: "white" },
      });
      return;
    }

    try {
      // For data URLs, we can create a download link directly
      if (qrCodeDataUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = qrCodeDataUrl;
        link.download = `${eventData.title || "event"}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For external URLs, fetch and convert to blob
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${eventData.title || "event"}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(url);
      }

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

  const openEventUrl = () => {
    window.open(eventUrl, "_blank");
  };

  const goToMyEvents = () => {
    router.push("/my-events");
    onClose();
  };

  const formatEventDate = (dateString: string | null) => {
    if (!dateString) return "No date set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit
                  ? "  🎉 Event Updated Successfully!"
                  : "  🎉 Event Created Successfully!"}
              </h2>
              <p className="text-gray-600 mt-1">
                Your event &ldquo;{eventData.title || "Untitled Event"}&rdquo;
                is now live
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Title:</span>{" "}
                {eventData.title || "No title available"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {formatEventDate(eventData.eventDate)}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {eventData.description || "No description available"}
              </p>
              <p>
                <span className="font-medium">Guest Limit:</span>{" "}
                {eventData.guestLimit || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Photo Cap Limit:</span>{" "}
                {eventData.photoCapLimit || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Event Flyer:</span>{" "}
                {eventData.eventFlyer ? (
                  <a
                    href={eventData.eventFlyer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Flyer
                  </a>
                ) : (
                  "No flyer uploaded"
                )}
              </p>
              <p>
                <span className="font-medium">Password Protected:</span>{" "}
                {eventData.isPasswordProtected ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
              {qrCodeLoading ? (
                <div className="w-48 h-48 mx-auto flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Loading QR code...
                  </span>
                </div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Event QR Code"
                  className="w-48 h-48 mx-auto"
                  onError={(e) => {
                    console.error("QR Code failed to load");
                    // Try fallback QR service
                    const fallbackUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(
                      eventUrl
                    )}`;
                    (e.target as HTMLImageElement).src = fallbackUrl;
                  }}
                />
              ) : (
                <div className="w-48 h-48 mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">
                      QR Code not available
                    </p>
                  </div>
                </div>
              )}
            </div>
            {qrCodeDataUrl && (
              <div className="mt-4 space-x-2">
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </Button>
              </div>
            )}
          </div>

          {/* Access URL */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Access URL</h3>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={eventUrl}
                readOnly
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <Button
                onClick={() => copyToClipboard(eventUrl, "url")}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                {copiedUrl ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copiedUrl ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={openEventUrl}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </Button>
            </div>
          </div>

          {/* Password (if protected) */}
          {eventData.isPasswordProtected && eventData.accessPassword && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Access Password</h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={eventData.accessPassword}
                  readOnly
                  className="flex-1 bg-transparent border-none outline-none text-sm font-mono"
                />
                <Button
                  onClick={() =>
                    copyToClipboard(eventData.accessPassword || "", "password")
                  }
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {copiedPassword ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedPassword ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Share the QR code or access URL with your guests</li>
              <li>
                • Guests can scan the QR code or visit the URL to join your
                event
              </li>
              {eventData.isPasswordProtected && (
                <li>
                  • Make sure to share the access password with your guests
                </li>
              )}
              <li>• You can manage your event from the My Events page</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            onClick={goToMyEvents}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            Go to My Events
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
