import React from "react";
import Image from "next/image";
import { ArrowRightIcon, X } from "lucide-react";

interface EventFlyerProps {
  flyer: string;
  title: string;
  date: string;
  onTakePhotos: () => void;
  onClose: () => void;
}

export default function EventFlyer({
  flyer,
  title,
  date,
  onTakePhotos,
  onClose,
}: EventFlyerProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-20 bg-black/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/40 transition-all duration-200 md:top-6 md:left-6 lg:p-3"
      >
        <X className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Background Image Container */}
      <div className="relative w-full h-full">
        <Image
          src={flyer}
          alt="Event Flyer"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={95}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:from-black/70 md:via-black/10"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Text Content */}
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
              {title}
            </h1>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl font-medium">
              {date}
            </p>
          </div>

          {/* Action Button */}
          <div className="w-full flex justify-center">
            <button
              onClick={onTakePhotos}
              className="bg-white hover:bg-gray-100 text-black font-semibold 
                       px-6 py-3.5 md:px-8 md:py-4 lg:px-10 lg:py-5
                       w-full max-w-sm md:max-w-md lg:max-w-lg
                       rounded-xl md:rounded-2xl
                       flex items-center justify-center gap-2 md:gap-3
                       text-base md:text-lg lg:text-xl
                       transition-all duration-200 
                       hover:scale-105 active:scale-95
                       shadow-lg hover:shadow-xl"
            >
              Take Photos
              <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Desktop-specific enhancements */}
      <div className="hidden lg:block absolute top-1/2 left-8 transform -translate-y-1/2">
        <div className="w-1 h-32 bg-white/20 rounded-full"></div>
      </div>
      <div className="hidden lg:block absolute top-1/2 right-8 transform -translate-y-1/2">
        <div className="w-1 h-32 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
}
