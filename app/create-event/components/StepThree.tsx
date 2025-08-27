// "use client";
// import React, { useState } from "react";
// import { StepProps } from "./types";

// const StepThree: React.FC<StepProps> = ({
//   handleChange,
//   validation,
//   goToNextStep,
// }) => {
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [fileType, setFileType] = useState<"image" | "video" | null>(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isEditMode) return;
//     setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseMove = (e: MouseEvent) => {
//     setOffset({
//       x: e.clientX - startPos.x,
//       y: e.clientY - startPos.y,
//     });
//   };

//   const handleMouseUp = () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);
//     setFileType(file.type.startsWith("video") ? "video" : "image");

//     handleChange(e); // Call parent handleChange
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start bg-primary text-white">
//       <div className="mb-8 text-center">
//         <h1 className="text-2xl font-bold">Cover</h1>
//         <p className="text-[#FCFCFE99]">
//           What participants see before they open the camera
//         </p>
//       </div>

//       {/* Phone Frame Preview */}
//       <div className="w-[200px] h-[400px] rounded-3xl border-[14px] border-black bg-black mb-6 overflow-hidden relative">
//         {previewUrl ? (
//           fileType === "image" ? (
//             <img
//               src={previewUrl}
//               alt="Preview"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <video
//               src={previewUrl}
//               className="w-full h-full object-cover"
//               autoPlay
//               loop
//               muted
//             />
//           )
//         ) : (
//           <div className="flex items-center justify-center w-full h-full text-white text-sm opacity-40">
//             No Preview
//           </div>
//         )}
//       </div>

//       {/* <div
//         className="w-[200px] h-[400px] rounded-3xl border-4 border-black bg-black mb-6 overflow-hidden relative"
//         onMouseDown={handleMouseDown}
//         style={{ cursor: isEditMode ? "grab" : "default" }}
//       >
//         {previewUrl && fileType === "image" && (
//           <img
//             src={previewUrl}
//             alt="Preview"
//             className="w-full h-auto absolute left-0"
//             style={{
//               top: `${offset.y}px`,
//               position: "absolute",
//               objectFit: "cover",
//               height: "auto",
//               transform: `translateY(${offset.y}px)`,
//             }}
//           />
//         )}
//       </div> */}

//       {/* Upload & Edit Buttons */}
//       <div className="flex gap-4 mb-8">
//         <label className="flex items-center gap-2 px-4 py-2 bg-[#6C5CE7] text-white rounded-lg cursor-pointer">
//           <svg
//             className="w-5 h-5 text-white"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 3H4zM10 14a4 4 0 100-8 4 4 0 000 8z" />
//           </svg>
//           Add Photo
//           <input
//             type="file"
//             accept="image/*,video/*"
//             name="cover"
//             onChange={handleFileChange}
//             className="hidden"
//             required
//           />
//         </label>

//         <button
//           type="button"
//           className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-white rounded-lg"
//           onClick={() => setIsEditMode(!isEditMode)}
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M11 5h4m4 0h.01M17 5v.01M6 9v6m0 0v6m0-6H2m4 0h4"
//             />
//           </svg>
//           {isEditMode ? "Done" : "Edit Cover"}
//         </button>
//       </div>

//       <form onSubmit={goToNextStep} className="w-full max-w-md">
//         <button
//           type="submit"
//           disabled={!validation.cover}
//           className={`w-full py-3 rounded-lg font-bold transition-colors ${
//             validation.cover
//               ? "bg-white text-black hover:bg-gray-200"
//               : "bg-gray-700 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           Next
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StepThree;

"use client";
import React, { useState, useRef, DragEvent, ChangeEvent } from "react";

interface StepThreeProps {
  formData: {
    title: string;
    description: string;
    eventFlyer: string;
    guestLimit: string;
    photoCapLimit: string;
    eventDate: string;
    isPasswordProtected: boolean;
    customPassword: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  validation: {
    title: boolean;
    description: boolean;
    eventFlyer: boolean;
    guestLimit: boolean;
    photoCapLimit: boolean;
    eventDate: boolean;
    isPasswordProtected: boolean;
    customPassword: boolean;
  };
  goToNextStep: (e: { preventDefault: () => void }) => void;
  fieldError?: string;
}

const StepThree: React.FC<StepThreeProps> = ({
  formData,
  handleChange,
  // validation,
  goToNextStep,
  fieldError,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(
    formData.eventFlyer || ""
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Replace with your Cloudinary details
  const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset";

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "event-flyers"); // Optional: organize uploads in folders

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Check file size (optional - Cloudinary handles this but good for UX)
    if (file.size > 25 * 1024 * 1024) {
      // 25MB limit
      setUploadError("File size must be less than 25MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // Create local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);

      // Clean up local preview
      URL.revokeObjectURL(localPreview);

      // Update with Cloudinary URL
      setPreviewUrl(cloudinaryUrl);

      // Update form data
      const syntheticEvent = {
        target: {
          name: "eventFlyer",
          value: cloudinaryUrl,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleChange(syntheticEvent);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
      setPreviewUrl(""); // Clear preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handlePhoneClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const clearImage = () => {
    setPreviewUrl("");
    setUploadError("");
    const syntheticEvent = {
      target: {
        name: "eventFlyer",
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start bg-primary text-white">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Event Flyer</h1>
        <p className="text-[#FCFCFE99]">
          Upload a flyer image that participants will see (optional)
        </p>
      </div>

      {/* Phone Frame Preview with Drag & Drop */}
      <div
        className={`w-[200px] h-[400px] rounded-3xl border-[14px] border-black bg-black mb-6 overflow-hidden relative cursor-pointer transition-all duration-200 ${
          isDragOver ? "ring-2 ring-white ring-opacity-50" : ""
        } ${
          !isUploading
            ? "hover:ring-2 hover:ring-gray-400"
            : "cursor-not-allowed"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handlePhoneClick}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Event Flyer Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                setUploadError("Failed to load image");
              }}
            />
            {/* Clear button */}
            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-90 transition-opacity"
              >
                ×
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-white text-sm opacity-40 p-4 text-center">
            {isUploading ? (
              <>
                <div className="animate-spin mb-2">⟳</div>
                <div>Uploading...</div>
              </>
            ) : (
              <>
                <div className="mb-2">📁</div>
                <div>Click to upload or drag image here</div>
                <div className="text-xs mt-2 opacity-60">
                  JPG, PNG, GIF up to 10MB
                </div>
              </>
            )}
          </div>
        )}

        {/* Drag overlay */}
        {isDragOver && !isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center text-white font-semibold">
            Drop image here
          </div>
        )}

        {/* Upload overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="animate-spin text-2xl mb-2">⟳</div>
              <div>Uploading...</div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      <form onSubmit={goToNextStep} className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-2 text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`text-white transition-colors ${
              isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-gray-300"
            }`}
          >
            {isUploading
              ? "Uploading..."
              : previewUrl
              ? "Change Image"
              : "Choose Image File"}
          </button>
        </div>

        {(uploadError || fieldError) && (
          <p className="text-red-400 text-sm mb-4">
            {uploadError || fieldError}
          </p>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            isUploading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {isUploading ? "Uploading..." : "Next"}
        </button>
      </form>
    </div>
  );
};

export default StepThree;
