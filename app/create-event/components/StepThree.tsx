"use client";
import React, { useState } from "react";
import { StepProps } from "./types";

const StepThree: React.FC<StepProps> = ({
  handleChange,
  validation,
  goToNextStep,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode) return;
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileType(file.type.startsWith("video") ? "video" : "image");

    handleChange(e); // Call parent handleChange
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start bg-primary text-white">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Cover</h1>
        <p className="text-[#FCFCFE99]">
          What participants see before they open the camera
        </p>
      </div>

      {/* Phone Frame Preview */}
      <div className="w-[200px] h-[400px] rounded-3xl border-[14px] border-black bg-black mb-6 overflow-hidden relative">
        {previewUrl ? (
          fileType === "image" ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
            />
          )
        ) : (
          <div className="flex items-center justify-center w-full h-full text-white text-sm opacity-40">
            No Preview
          </div>
        )}
      </div>

      {/* <div
        className="w-[200px] h-[400px] rounded-3xl border-4 border-black bg-black mb-6 overflow-hidden relative"
        onMouseDown={handleMouseDown}
        style={{ cursor: isEditMode ? "grab" : "default" }}
      >
        {previewUrl && fileType === "image" && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto absolute left-0"
            style={{
              top: `${offset.y}px`,
              position: "absolute",
              objectFit: "cover",
              height: "auto",
              transform: `translateY(${offset.y}px)`,
            }}
          />
        )}
      </div> */}

      {/* Upload & Edit Buttons */}
      <div className="flex gap-4 mb-8">
        <label className="flex items-center gap-2 px-4 py-2 bg-[#6C5CE7] text-white rounded-lg cursor-pointer">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 3H4zM10 14a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          Add Photo
          <input
            type="file"
            accept="image/*,video/*"
            name="cover"
            onChange={handleFileChange}
            className="hidden"
            required
          />
        </label>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-gray-500 text-white rounded-lg"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5h4m4 0h.01M17 5v.01M6 9v6m0 0v6m0-6H2m4 0h4"
            />
          </svg>
          {isEditMode ? "Done" : "Edit Cover"}
        </button>
      </div>

      <form onSubmit={goToNextStep} className="w-full max-w-md">
        <button
          type="submit"
          disabled={!validation.cover}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            validation.cover
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default StepThree;
