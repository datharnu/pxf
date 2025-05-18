"use client";
import React, { useState } from "react";
import { StepProps } from "./types";
import Image from "next/image";

const guestOptions = [10, 100, 250, 400, 600, 800, "801+"];

const priceMap: Record<number | string, string> = {
  10: "FREE",
  100: "₦5,000",
  250: "₦10,000",
  400: "₦15,000",
  600: "₦20,000",
  800: "₦25,000",
  "801+": "₦30,000",
};

const StepFour: React.FC<StepProps> = ({
  formData,
  handleChange,
  validation,
  goToNextStep,
}) => {
  const [selectedGuest, setSelectedGuest] = useState<number | string>(
    formData.howManyGuests || 10
  );

  const handleGuestSelect = (value: number | string) => {
    const numericValue = typeof value === "string" ? 801 : value;
    setSelectedGuest(value);
    handleChange({
      target: {
        name: "howManyGuests",
        value: numericValue,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const isFree = selectedGuest === 10;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start bg-primary text-white">
      {/* Phone Image with screen content */}
      <div className="mb-6 relative w-[200px] h-[400px] rounded-[2.5rem] border-[14px] border-black shadow-2xl bg-black overflow-hidden">
        <Image
          src="/pic3.jpg" // Replace with your image
          alt="Phone screen preview"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <h1 className="text-xl font-semibold mb-6 text-center">
        How many guests would you like to accommodate?
      </h1>

      <form className="w-full max-w-sm" onSubmit={goToNextStep}>
        <div className="bg-gray-800 p-2 rounded-xl flex justify-between gap-1 mb-4">
          {guestOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGuest === opt
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
              onClick={() => handleGuestSelect(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

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
          disabled={!validation.howManyGuests}
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
            validation.howManyGuests
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
