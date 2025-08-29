/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
// import React, { useRef, useEffect, useState } from "react";
// import { X, ScanLine, Camera } from "lucide-react";
// // Import QR Scanner library
// // npm install qr-scanner @types/qr-scanner
// import QrScanner from "qr-scanner";

// // Type definitions
// interface QRCodeScannerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onScan: (data: string) => void;
// }

// interface QRScannerDemoProps {
//   onScan: (data: string) => void;
// }

// export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
//   isOpen,
//   onClose,
//   onScan,
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(false);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [hasPermission, setHasPermission] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const qrScannerRef = useRef<QrScanner | null>(null);

//   useEffect(() => {
//     if (isOpen) {
//       startCamera();
//     } else {
//       stopCamera();
//     }

//     return () => {
//       stopCamera();
//     };
//   }, [isOpen]);

//   const startCamera = async (): Promise<void> => {
//     try {
//       setError("");

//       if (!videoRef.current) return;

//       // Create QR Scanner instance
//       qrScannerRef.current = new QrScanner(
//         videoRef.current,
//         (result: QrScanner.ScanResult) => {
//           console.log("QR Code detected:", result.data);
//           setIsScanning(false);
//           onScan(result.data);
//         },
//         {
//           // eslint-disable-next-line @typescript-eslint/no-unused-vars
//           onDecodeError: (err: string | Error) => {
//             // Handle decode errors silently - this happens when no QR code is detected
//             // console.log('Decode error:', err);
//           },
//           highlightScanRegion: false, // We'll use our own overlay
//           highlightCodeOutline: false,
//           preferredCamera: "environment", // Use back camera
//           maxScansPerSecond: 5, // Limit scanning rate
//         }
//       );

//       // Start scanning
//       await qrScannerRef.current.start();
//       setHasPermission(true);
//       setIsScanning(true);
//     } catch (err: unknown) {
//       console.error("Camera access error:", err);
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const errorMessage =
//         err instanceof Error ? err.message : "Unknown error occurred";
//       setError(
//         "Camera access denied. Please allow camera permissions and try again."
//       );
//     }
//   };

//   const stopCamera = (): void => {
//     if (qrScannerRef.current) {
//       qrScannerRef.current.stop();
//       qrScannerRef.current.destroy();
//       qrScannerRef.current = null;
//     }

//     setHasPermission(false);
//     setIsScanning(false);
//   };

//   const handleRetry = (): void => {
//     startCamera();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black z-50 flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
//         <div className="flex items-center gap-3">
//           <ScanLine className="w-6 h-6 text-white" />
//           <h2 className="text-white font-semibold text-lg">QR Scanner</h2>
//         </div>
//         <button
//           onClick={onClose}
//           className="text-white hover:text-gray-300 transition-colors"
//           type="button"
//           aria-label="Close scanner"
//         >
//           <X className="w-6 h-6" />
//         </button>
//       </div>

//       {/* Camera Container */}
//       <div className="flex-1 relative overflow-hidden">
//         {error ? (
//           <div className="absolute inset-0 flex items-center justify-center bg-black">
//             <div className="text-center px-6">
//               <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-white text-lg mb-4">{error}</p>
//               <button
//                 onClick={handleRetry}
//                 className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//                 type="button"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Video Element */}
//             <video
//               ref={videoRef}
//               className="absolute inset-0 w-full h-full object-cover"
//               playsInline
//               muted
//               autoPlay
//             />

//             {/* QR Scanner handles the camera feed automatically */}

//             {/* Overlay with scanning frame */}
//             <div className="absolute inset-0 bg-black/40">
//               {/* Scanning Frame */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="relative w-64 h-64">
//                   {/* Corner brackets */}
//                   <div className="absolute top-0 left-0 w-8 h-8">
//                     <div className="absolute top-0 left-0 w-full h-1 bg-white rounded-full"></div>
//                     <div className="absolute top-0 left-0 w-1 h-full bg-white rounded-full"></div>
//                   </div>
//                   <div className="absolute top-0 right-0 w-8 h-8">
//                     <div className="absolute top-0 right-0 w-full h-1 bg-white rounded-full"></div>
//                     <div className="absolute top-0 right-0 w-1 h-full bg-white rounded-full"></div>
//                   </div>
//                   <div className="absolute bottom-0 left-0 w-8 h-8">
//                     <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full"></div>
//                     <div className="absolute bottom-0 left-0 w-1 h-full bg-white rounded-full"></div>
//                   </div>
//                   <div className="absolute bottom-0 right-0 w-8 h-8">
//                     <div className="absolute bottom-0 right-0 w-full h-1 bg-white rounded-full"></div>
//                     <div className="absolute bottom-0 right-0 w-1 h-full bg-white rounded-full"></div>
//                   </div>

//                   {/* Scanning line animation */}
//                   {isScanning && (
//                     <div className="absolute inset-0 overflow-hidden rounded-lg">
//                       <div
//                         className="absolute w-full h-0.5 bg-orange-500 animate-pulse shadow-lg shadow-orange-500/50"
//                         style={{
//                           animation: "scan 2s linear infinite",
//                           top: "0%",
//                         }}
//                       ></div>
//                     </div>
//                   )}

//                   {/* Center dot */}
//                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                     <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Instructions */}
//               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
//                 <div className="text-center">
//                   <div className="flex items-center justify-center gap-3 mb-3">
//                     <ScanLine className="w-8 h-8 text-white animate-pulse" />
//                   </div>
//                   <h3 className="text-white text-xl font-semibold mb-2">
//                     Scan a PXF QR Code
//                   </h3>
//                   <p className="text-gray-300 text-sm">
//                     Position the QR code within the frame to join an event
//                   </p>
//                   {isScanning && (
//                     <div className="mt-4">
//                       <div className="inline-flex items-center gap-2 bg-orange-600/20 px-4 py-2 rounded-full">
//                         <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
//                         <span className="text-orange-200 text-sm font-medium">
//                           Scanning...
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Custom CSS for scan animation */}
//       <style jsx>{`
//         @keyframes scan {
//           0% {
//             top: 0%;
//           }
//           50% {
//             top: 100%;
//           }
//           100% {
//             top: 0%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Demo component showing the integration
// const QRScannerDemo: React.FC<QRScannerDemoProps> = () => {
//   const [showScanner, setShowScanner] = useState<boolean>(false);
//   const [scannedData, setScannedData] = useState<string>("");

//   const handleScan = (data: string): void => {
//     console.log("QR Code scanned:", data);
//     setScannedData(data);
//     setShowScanner(false);
//     // Here you would typically navigate to the event or process the QR data
//     alert(`QR Code Scanned: ${data}`);
//   };

//   const openScanner = (): void => {
//     setShowScanner(true);
//   };

//   const closeScanner = (): void => {
//     setShowScanner(false);
//   };

//   return (
//     <div className="min-h-screen bg-black p-4">
//       {/* Header similar to your app */}
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-semibold text-white">Cameras</h1>
//           <button
//             onClick={openScanner}
//             className="flex items-center gap-3 bg-[#353935] py-2 px-3 rounded-full cursor-pointer hover:bg-[#404140] transition-colors"
//             type="button"
//           >
//             <ScanLine className="w-4 h-4 text-white" />
//             <span className="text-white font-semibold">Join</span>
//           </button>
//         </div>

//         <div className="text-center py-12">
//           <p className="text-gray-400 mb-4">
//             Click the &quot;Join&quot; button to scan a QR code
//           </p>
//           {scannedData && (
//             <div className="bg-[#353935] p-4 rounded-lg">
//               <p className="text-white">Last scanned: {scannedData}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* QR Scanner Modal */}
//       <QRCodeScanner
//         isOpen={showScanner}
//         onClose={closeScanner}
//         onScan={handleScan}
//       />
//     </div>
//   );
// };

// import React, { useRef, useEffect, useState } from "react";
// import { X, ScanLine, Camera, Lock } from "lucide-react";
// import QrScanner from "qr-scanner";
// import { useRouter } from "next/navigation";
// import { api } from "@/api/axios";

// // Type definitions
// interface QRCodeScannerProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface EventData {
//   id: string;
//   title: string;
//   isPasswordProtected: boolean;
//   eventSlug: string;
// }

// interface PasswordModalProps {
//   isOpen: boolean;
//   eventTitle: string;
//   onClose: () => void;
//   onSubmit: (password: string) => void;
//   error?: string;
// }

// export const PasswordModal: React.FC<PasswordModalProps> = ({
//   isOpen,
//   eventTitle,
//   onClose,
//   onSubmit,
//   error,
// }) => {
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password.trim()) {
//       onSubmit(password);
//       setPassword("");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md border border-gray-700">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <Lock className="w-6 h-6 text-orange-500" />
//             <h2 className="text-white font-semibold text-lg">Event Access</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="mb-6">
//           <p className="text-gray-300 mb-2">
//             <span className="font-medium text-white">{eventTitle}</span>{" "}
//             requires a password to join.
//           </p>
//           <p className="text-gray-400 text-sm">
//             Please enter the event password provided by the organizer.
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-300 mb-2"
//             >
//               Event Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               placeholder="Enter password..."
//               autoFocus
//             />
//           </div>

//           {error && (
//             <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
//               <p className="text-red-200 text-sm">{error}</p>
//             </div>
//           )}

//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!password.trim()}
//               className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
//             >
//               Join Event
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const qrScannerRef = useRef<QrScanner | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (isOpen) {
//       startCamera();
//     } else {
//       stopCamera();
//     }

//     return () => {
//       stopCamera();
//     };
//   }, [isOpen]);

//   const extractEventIdentifier = (data: string): string | null => {
//     // Check if it's a URL and extract the ID/slug
//     if (data.includes("/")) {
//       try {
//         const url = new URL(data);
//         const pathParts = url.pathname.split("/");
//         const lastPart = pathParts[pathParts.length - 1];

//         // Check if it's a UUID format
//         if (
//           /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
//             lastPart
//           )
//         ) {
//           return lastPart;
//         } else {
//           return lastPart;
//         }
//       } catch {
//         // If URL parsing fails, treat as direct identifier
//         return data;
//       }
//     } else {
//       // Direct UUID or slug
//       return data;
//     }
//   };

//   const getEventDetails = async (identifier: string): Promise<EventData> => {
//     try {
//       // Check if identifier is a UUID
//       if (
//         /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
//           identifier
//         )
//       ) {
//         // Use the ID endpoint
//         const response = await api.get(`/events/${identifier}`);
//         const data = response.data;

//         if (!data.success) {
//           throw new Error(data.message || "Failed to get event details");
//         }

//         if (
//           !data.event ||
//           typeof data.event.isPasswordProtected === "undefined"
//         ) {
//           throw new Error("Invalid event data received");
//         }

//         return data.event;
//       } else {
//         // Use the verify endpoint to check password requirement
//         // For POST requests with no body, we can send an empty object
//         const response = await api.post(`/events/verify/${identifier}`, {});
//         const data = response.data;

//         if (!data.success) {
//           throw new Error(data.message || "Failed to get event details");
//         }

//         if (
//           !data.event ||
//           typeof data.event.isPasswordProtected === "undefined"
//         ) {
//           throw new Error("Invalid event data received");
//         }

//         return data.event;
//       }
//     } catch (error: any) {
//       console.error("API Error:", error.response?.data || error.message);

//       if (error.response?.status === 400) {
//         throw new Error("Invalid event identifier or malformed request");
//       }

//       throw new Error(
//         error.response?.data?.message || "Failed to get event details"
//       );
//     }
//   };

//   const handlePasswordSubmit = async (password: string) => {
//     setIsProcessing(true);
//     setError("");

//     try {
//       if (!currentEvent) {
//         throw new Error("No event selected");
//       }

//       // Verify access with password
//       const accessResponse = await api.post(
//         `/events/access/${currentEvent.eventSlug || currentEvent.id}`,
//         { password }
//       );

//       const accessData = accessResponse.data;

//       if (!accessData.success) {
//         throw new Error(accessData.message || "Access denied");
//       }

//       setShowPasswordModal(false);
//       navigateToEvent(currentEvent, accessData.accessToken);
//     } catch (err: any) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to verify password";
//       setError(errorMessage);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const navigateToEvent = (event: EventData, accessToken?: string) => {
//     // Using Next.js router to navigate
//     // Store the access token in localStorage or pass as query param
//     if (accessToken) {
//       localStorage.setItem(`eventAccess_${event.id}`, accessToken);
//     }

//     router.push(`/event/${event.id}`);
//   };

//   const handleScan = async (data: string) => {
//     setIsProcessing(true);
//     setError("");

//     try {
//       const eventIdentifier = extractEventIdentifier(data);

//       if (!eventIdentifier) {
//         throw new Error("Invalid QR code data");
//       }

//       // Get event details
//       const eventDetails = await getEventDetails(eventIdentifier);

//       if (eventDetails.isPasswordProtected) {
//         // Show password modal
//         setCurrentEvent(eventDetails);
//         setShowPasswordModal(true);
//       } else {
//         // No password required, navigate directly
//         navigateToEvent(eventDetails);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to process QR code");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const startCamera = async (): Promise<void> => {
//     try {
//       setError("");

//       if (!videoRef.current) return;

//       // Create QR Scanner instance
//       qrScannerRef.current = new QrScanner(
//         videoRef.current,
//         (result: QrScanner.ScanResult) => {
//           console.log("QR Code detected:", result.data);
//           setIsScanning(false);
//           handleScan(result.data);
//         },
//         {
//           onDecodeError: () => {
//             // Handle decode errors silently
//           },
//           highlightScanRegion: false,
//           highlightCodeOutline: false,
//           preferredCamera: "environment",
//           maxScansPerSecond: 5,
//         }
//       );

//       // Start scanning
//       await qrScannerRef.current.start();
//       setIsScanning(true);
//     } catch (err: unknown) {
//       console.error("Camera access error:", err);
//       setError(
//         "Camera access denied. Please allow camera permissions and try again."
//       );
//     }
//   };

//   const stopCamera = (): void => {
//     if (qrScannerRef.current) {
//       qrScannerRef.current.stop();
//       qrScannerRef.current.destroy();
//       qrScannerRef.current = null;
//     }

//     setIsScanning(false);
//   };

//   const handleRetry = (): void => {
//     startCamera();
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="fixed inset-0 bg-black z-50 flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <ScanLine className="w-6 h-6 text-white" />
//             <h2 className="text-white font-semibold text-lg">QR Scanner</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-300 transition-colors"
//             type="button"
//             aria-label="Close scanner"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Camera Container */}
//         <div className="flex-1 relative overflow-hidden">
//           {error ? (
//             <div className="absolute inset-0 flex items-center justify-center bg-black">
//               <div className="text-center px-6">
//                 <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <p className="text-white text-lg mb-4">{error}</p>
//                 <button
//                   onClick={handleRetry}
//                   className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//                   type="button"
//                 >
//                   Retry
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Video Element */}
//               <video
//                 ref={videoRef}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 playsInline
//                 muted
//                 autoPlay
//               />

//               {/* Overlay with scanning frame */}
//               <div className="absolute inset-0 bg-black/40">
//                 {/* Scanning Frame */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="relative w-64 h-64">
//                     {/* Corner brackets */}
//                     <div className="absolute top-0 left-0 w-8 h-8">
//                       <div className="absolute top-0 left-0 w-full h-1 bg-white rounded-full"></div>
//                       <div className="absolute top-0 left-0 w-1 h-full bg-white rounded-full"></div>
//                     </div>
//                     <div className="absolute top-0 right-0 w-8 h-8">
//                       <div className="absolute top-0 right-0 w-full h-1 bg-white rounded-full"></div>
//                       <div className="absolute top-0 right-0 w-1 h-full bg-white rounded-full"></div>
//                     </div>
//                     <div className="absolute bottom-0 left-0 w-8 h-8">
//                       <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full"></div>
//                       <div className="absolute bottom-0 left-0 w-1 h-full bg-white rounded-full"></div>
//                     </div>
//                     <div className="absolute bottom-0 right-0 w-8 h-8">
//                       <div className="absolute bottom-0 right-0 w-full h-1 bg-white rounded-full"></div>
//                       <div className="absolute bottom-0 right-0 w-1 h-full bg-white rounded-full"></div>
//                     </div>

//                     {/* Scanning line animation */}
//                     {isScanning && (
//                       <div className="absolute inset-0 overflow-hidden rounded-lg">
//                         <div
//                           className="absolute w-full h-0.5 bg-orange-500 animate-pulse shadow-lg shadow-orange-500/50"
//                           style={{
//                             animation: "scan 2s linear infinite",
//                             top: "0%",
//                           }}
//                         ></div>
//                       </div>
//                     )}

//                     {/* Center dot */}
//                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                       <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Instructions */}
//                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
//                   <div className="text-center">
//                     <div className="flex items-center justify-center gap-3 mb-3">
//                       <ScanLine className="w-8 h-8 text-white animate-pulse" />
//                     </div>
//                     <h3 className="text-white text-xl font-semibold mb-2">
//                       Scan a PXF QR Code
//                     </h3>
//                     <p className="text-gray-300 text-sm">
//                       Position the QR code within the frame to join an event
//                     </p>
//                     {isScanning && (
//                       <div className="mt-4">
//                         <div className="inline-flex items-center gap-2 bg-orange-600/20 px-4 py-2 rounded-full">
//                           <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
//                           <span className="text-orange-200 text-sm font-medium">
//                             Scanning...
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                     {isProcessing && (
//                       <div className="mt-4">
//                         <div className="inline-flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-full">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                           <span className="text-blue-200 text-sm font-medium">
//                             Processing...
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Custom CSS for scan animation */}
//         <style>{`
//           @keyframes scan {
//             0% {
//               top: 0%;
//             }
//             50% {
//               top: 100%;
//             }
//             100% {
//               top: 0%;
//             }
//           }
//         `}</style>
//       </div>

//       {/* Password Modal */}
//       <PasswordModal
//         isOpen={showPasswordModal}
//         eventTitle={currentEvent?.title || ""}
//         onClose={() => setShowPasswordModal(false)}
//         onSubmit={handlePasswordSubmit}
//         error={error}
//       />
//     </>
//   );
// };

// // Demo component showing the integration
// export const QRScannerDemo: React.FC = () => {
//   const [showScanner, setShowScanner] = useState<boolean>(false);

//   const openScanner = (): void => {
//     setShowScanner(true);
//   };

//   const closeScanner = (): void => {
//     setShowScanner(false);
//   };

//   return (
//     <div className="min-h-screen bg-black p-4">
//       {/* Header similar to your app */}
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-semibold text-white">Cameras</h1>
//           <button
//             onClick={openScanner}
//             className="flex items-center gap-3 bg-[#353935] py-2 px-3 rounded-full cursor-pointer hover:bg-[#404140] transition-colors"
//             type="button"
//           >
//             <ScanLine className="w-4 h-4 text-white" />
//             <span className="text-white font-semibold">Join</span>
//           </button>
//         </div>

//         <div className="text-center py-12">
//           <p className="text-gray-400 mb-4">
//             Click the &quot;Join&quot; button to scan a QR code
//           </p>
//         </div>
//       </div>

//       {/* QR Scanner Modal */}
//       <QRCodeScanner isOpen={showScanner} onClose={closeScanner} />
//     </div>
//   );
// };

// export default QRScannerDemo;

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
      setError("Invalid event QR code. Please scan a valid PXF event QR code.");

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
          <h1 className="text-3xl font-semibold text-white">PXF Events</h1>
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
