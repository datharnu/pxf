/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
// import React, { useRef, useEffect, useState } from "react";
// import { X, ScanLine, Camera } from "lucide-react";
// // Import QR Scanner library
// // npm install qr-scanner @types/qr-scanner

import React, { useRef, useEffect, useState } from "react";
import { X, ScanLine, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";

// Type definitions
interface QRCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan?: (data: string) => void; // Made optional since we'll handle navigation internally
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const extractEventSlug = (qrData: string): string | null => {
    try {
      console.log("QR Data received:", qrData);

      // Handle different QR code formats
      if (qrData.includes("/event/")) {
        // Extract slug from full URL: https://yourapp.com/event/abc123
        const match = qrData.match(/\/event\/([^\/\?#]+)/);
        if (match && match[1]) {
          console.log("Extracted slug from URL:", match[1]);
          return match[1];
        }
      }

      // If QR code contains just the slug (abc123)
      // Validate it's a valid event slug format
      if (/^[a-zA-Z0-9_-]+$/.test(qrData) && qrData.length >= 6) {
        console.log("QR data appears to be a direct slug:", qrData);
        return qrData;
      }

      // Try to parse as URL and extract pathname
      const url = new URL(qrData);
      if (url.pathname.includes("/event/")) {
        const match = url.pathname.match(/\/event\/([^\/]+)/);
        if (match && match[1]) {
          console.log("Extracted slug from parsed URL:", match[1]);
          return match[1];
        }
      }

      return null;
    } catch (error) {
      console.error("Error extracting slug from QR data:", error);
      return null;
    }
  };

  const handleQRCodeDetected = (qrData: string): void => {
    console.log("QR Code detected:", qrData);
    setIsScanning(false);

    // Extract event slug from QR data
    const eventSlug = extractEventSlug(qrData);

    if (eventSlug) {
      console.log("Navigating to event:", eventSlug);
      // Close scanner and navigate to event page
      // This will trigger the same EventSlugPage flow as URL access
      onClose();
      router.push(`/event/${eventSlug}`);
    } else {
      console.error("Invalid QR code format");
      setError(
        "Invalid event QR code. Please scan a valid Picha event QR code."
      );

      // Auto-retry after 3 seconds
      setTimeout(() => {
        setError("");
        startCamera();
      }, 3000);
    }

    // Call optional onScan callback if provided
    if (onScan) {
      onScan(qrData);
    }
  };

  const startCamera = async (): Promise<void> => {
    try {
      setError("");

      if (!videoRef.current) return;

      // Create QR Scanner instance
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result: QrScanner.ScanResult) => {
          handleQRCodeDetected(result.data);
        },
        {
          onDecodeError: (err: string | Error) => {
            // Handle decode errors silently - this happens when no QR code is detected
            // console.log('Decode error:', err);
          },
          highlightScanRegion: false, // We'll use our own overlay
          highlightCodeOutline: false,
          preferredCamera: "environment", // Use back camera
          maxScansPerSecond: 5, // Limit scanning rate
        }
      );

      // Start scanning
      await qrScannerRef.current.start();
      setHasPermission(true);
      setIsScanning(true);
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(
        "Camera access denied. Please allow camera permissions and try again."
      );
    }
  };

  const stopCamera = (): void => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }

    setHasPermission(false);
    setIsScanning(false);
  };

  const handleRetry = (): void => {
    setError("");
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <ScanLine className="w-6 h-6 text-white" />
          <h2 className="text-white font-semibold text-lg">Join Event</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
          type="button"
          aria-label="Close scanner"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera Container */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center px-6 max-w-sm">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-white text-lg mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                type="button"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Video Element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />

            {/* Overlay with scanning frame */}
            <div className="absolute inset-0 bg-black/40">
              {/* Scanning Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white rounded-full"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8">
                    <div className="absolute top-0 right-0 w-full h-1 bg-white rounded-full"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-8 h-8">
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-1 h-full bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-full bg-white rounded-full"></div>
                  </div>

                  {/* Scanning line animation */}
                  {isScanning && (
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div
                        className="absolute w-full h-0.5 bg-orange-500 animate-pulse shadow-lg shadow-orange-500/50"
                        style={{
                          animation: "scan 2s linear infinite",
                          top: "0%",
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Center dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <ScanLine className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Scan Event QR Code
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Position the QR code within the frame to join the event
                  </p>
                  {isScanning && (
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 bg-orange-600/20 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-orange-200 text-sm font-medium">
                          Scanning...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom CSS for scan animation */}
      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Usage example in your main component
interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const openScanner = (): void => {
    setShowScanner(true);
  };

  const closeScanner = (): void => {
    setShowScanner(false);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-white">Picha Events</h1>
          <button
            onClick={openScanner}
            className="flex items-center gap-3 bg-[#353935] py-2 px-3 rounded-full cursor-pointer hover:bg-[#404140] transition-colors"
            type="button"
          >
            <ScanLine className="w-4 h-4 text-white" />
            <span className="text-white font-semibold">Join Event</span>
          </button>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            Click &quot;Join Event&quot; to scan a QR code and join an event
          </p>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRCodeScanner isOpen={showScanner} onClose={closeScanner} />
    </div>
  );
};
