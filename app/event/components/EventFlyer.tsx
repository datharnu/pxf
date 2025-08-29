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
    <div>
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 bg-black/10 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <div>
        <Image
          src={flyer}
          alt="Event Flyer"
          className="w-full h-screen object-cover"
          width={200}
          height={400}
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      <div className="w-full absolute bottom-16">
        <div className="  space-y-5  ">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-white font-bold text-3xl">{title}</h1>
            <p className="text-[#aaaaaa] text-lg font-semibold">{date}</p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={onTakePhotos}
              className=" bg-white text-black   font-semibold px-4 py-3.5 w-[90vw] justify-center rounded-lg flex items-center gap-2"
            >
              Take Photos
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
