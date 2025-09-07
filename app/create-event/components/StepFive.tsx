"use client";
import React from "react";
import Image from "next/image";

const photoOptions = ["5", "10", "15", "20", "25"];

const guestToPhotoMap: Record<string, string> = {
  "10": "5",
  "100": "10",
  "250": "15",
  "500": "20",
  "800": "25",
  "1000+": "25",
};

interface StepFiveProps {
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
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting?: boolean;
  fieldErrors?: Record<string, string>;
}

const StepFive: React.FC<StepFiveProps> = ({
  formData,
  handleChange,
  validation,
  handleSubmit,
  isSubmitting = false,
  fieldErrors = {},
}) => {
  const isCustomGuest = formData.guestLimit === "CUSTOM";
  const isCustomPhoto = formData.photoCapLimit === "CUSTOM";
  const enforcedPhoto = guestToPhotoMap[formData.guestLimit];
  const isPairValid =
    isCustomGuest ||
    isCustomPhoto ||
    (enforcedPhoto !== undefined && formData.photoCapLimit === enforcedPhoto);

  const handlePhotoOptionClick = (value: string) => {
    if (!isCustomGuest && !isCustomPhoto) {
      // Only allow the enforced value for the selected guestLimit
      if (enforcedPhoto !== value) return;
    }
    handleChange({
      target: {
        name: "photoCapLimit",
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 snap-start">
      {/* Phone Image */}
      <div className="mb-6 relative w-[200px] h-[400px] rounded-[2.5rem] border-[14px] border-black shadow-2xl bg-black overflow-hidden">
        <Image
          src="/Adobe1.png"
          alt="Phone screen preview"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <h1 className="text-xl font-semibold text-center mb-2 text-white">
        Photos per Person
      </h1>
      <p className="text-sm text-center text-gray-400 mb-6">
        Limited # of photos each person can take before the end date
      </p>

      {/* Photo Options */}
      <div className="flex gap-3 mb-6">
        {(isCustomGuest || isCustomPhoto
          ? photoOptions
          : enforcedPhoto
          ? [enforcedPhoto]
          : []
        ).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handlePhotoOptionClick(num)}
            className={`px-4 py-2 rounded-lg font-bold text-sm ${
              formData.photoCapLimit === num
                ? "bg-violet-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      {fieldErrors.photoCapLimit && (
        <p className="text-red-400 text-sm mb-4 text-center">
          {fieldErrors.photoCapLimit}
        </p>
      )}
      {!isPairValid && (
        <p className="text-red-400 text-sm mb-4 text-center">
          Please select the required photo cap for the chosen guest limit.
        </p>
      )}

      {/* Event Date Input */}

      <div className="w-full max-w-md mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Event Date *
        </label>
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
          required
          min={new Date().toLocaleDateString("en-CA")} // allow today; block past dates (uses local date)
        />
        {fieldErrors.eventDate && (
          <p className="text-red-400 text-sm mt-1">{fieldErrors.eventDate}</p>
        )}
      </div>

      {/* Password Protection */}
      <div className="w-full max-w-md mb-6">
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="isPasswordProtected"
            checked={formData.isPasswordProtected}
            onChange={handleChange}
            className="w-4 h-4 text-violet-600 bg-gray-800 border-gray-600 rounded focus:ring-violet-500"
          />
          <span className="text-sm text-gray-300">
            Password protect this event
          </span>
        </label>

        {formData.isPasswordProtected && (
          <div>
            <input
              type="password"
              name="customPassword"
              placeholder="Enter password (min. 4 characters)"
              value={formData.customPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
              required
              minLength={4}
            />
            {fieldErrors.customPassword && (
              <p className="text-red-400 text-sm mt-1">
                {fieldErrors.customPassword}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <button
          type="submit"
          disabled={
            !validation.photoCapLimit ||
            !validation.eventDate ||
            !validation.customPassword ||
            isSubmitting ||
            !isPairValid
          }
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            validation.photoCapLimit &&
            validation.eventDate &&
            validation.customPassword &&
            !isSubmitting &&
            isPairValid
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting
            ? "Processing..."
            : formData.guestLimit === "10"
            ? "Create Event"
            : "Create & Continue to Payment"}
        </button>
      </form>
    </div>
  );
};

export default StepFive;
