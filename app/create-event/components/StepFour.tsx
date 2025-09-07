"use client";
import React, { useState } from "react";
import Image from "next/image";

const guestOptions = ["10", "100", "250", "500", "800", "1000+", "CUSTOM"];

const priceMap: Record<string, string> = {
  "10": "FREE",
  "100": "₦7,000",
  "250": "₦12,000",
  "500": "₦18,000",
  "800": "₦23,000",
  "1000+": "₦28,000",
};

interface StepFourProps {
  formData: {
    title: string;
    description: string;
    eventFlyer: string;
    guestLimit: string;
    photoCapLimit: string;
    eventDate: string;
    isPasswordProtected: boolean;
    customPassword: string;
    customGuestLimit?: number;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  readOnly?: boolean;
  validation: {
    title: boolean;
    description: boolean;
    eventFlyer: boolean;
    guestLimit: boolean;
    photoCapLimit: boolean;
    eventDate: boolean;
    isPasswordProtected: boolean;
    customPassword: boolean;
    customGuestLimit?: boolean;
  };
  goToNextStep: (e: { preventDefault: () => void }) => void;
  fieldError?: string;
}

const StepFour: React.FC<StepFourProps> = ({
  formData,
  handleChange,
  readOnly,
  validation,
  goToNextStep,
  fieldError,
}) => {
  const guestToPhotoMap: Record<string, string> = {
    "10": "5",
    "100": "10",
    "250": "15",
    "500": "20",
    "800": "25",
    "1000+": "25",
  };
  const [selectedGuest, setSelectedGuest] = useState<string>(
    formData.guestLimit || "10"
  );

  const handleGuestSelect = (value: string) => {
    if (readOnly) return;
    setSelectedGuest(value);
    handleChange({
      target: {
        name: "guestLimit",
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>);

    const isCustomGuest = value === "CUSTOM";
    const isCustomPhoto = formData.photoCapLimit === "CUSTOM";
    const mappedPhoto = guestToPhotoMap[value];
    if (!isCustomGuest && !isCustomPhoto && mappedPhoto) {
      handleChange({
        target: {
          name: "photoCapLimit",
          value: mappedPhoto,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const isFree = selectedGuest === "10";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start bg-primary text-white">
      {/* Phone Image with screen content */}
      <div className="mb-6 relative w-[200px] h-[400px] rounded-[2.5rem] border-[14px] border-black shadow-2xl bg-black overflow-hidden">
        <Image
          src="/pic3.jpg"
          alt="Phone screen preview"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <h1 className="text-xl font-semibold mb-6 text-center">
        How many guests would you like to accommodate?
      </h1>

      <form className="w-full max-w-sm" onSubmit={goToNextStep}>
        <div className="bg-gray-800 p-2 rounded-xl flex flex-wrap justify-center gap-2 mb-2">
          {guestOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGuest === opt
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              } ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={() => handleGuestSelect(opt)}
              disabled={!!readOnly}
            >
              {opt}
            </button>
          ))}
        </div>

        {selectedGuest === "CUSTOM" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              Enter custom guest count (minimum 1001)
            </label>
            <input
              type="number"
              name="customGuestLimit"
              min={1001}
              value={
                (formData as unknown as { customGuestLimit?: number })
                  .customGuestLimit ?? ""
              }
              onChange={handleChange}
              disabled={!!readOnly}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
              placeholder="e.g., 1500"
            />
            {validation.customGuestLimit === false && (
              <p className="text-red-400 text-sm mt-2">
                Please enter a valid custom guest count (&ge; 1001).
              </p>
            )}
          </div>
        )}

        {fieldError && (
          <p className="text-red-400 text-sm mb-4 text-center">{fieldError}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-300 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span>Up to {selectedGuest} guests</span>
          <span
            className={`ml-auto font-medium ${
              isFree ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {isFree ? "FREE" : `Starts at ${priceMap[selectedGuest]}`}
          </span>
        </div>

        <button
          type="submit"
          disabled={!validation.guestLimit}
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
            validation.guestLimit
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default StepFour;
