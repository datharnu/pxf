import Image from "next/image";
import React from "react";
import Partners from "./Partners";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { FaCamera } from "react-icons/fa";

export default function Features() {
  return (
    <div className="bg-primary ">
      <div className="lg:flex justify-center">
        <Partners />
      </div>
      <div className="flex justify-center">
        <div className="w-full mx-4 md:mx-8 lg:mx-32 my-8 md:my-12  max-w-[90rem]">
          {/* For mobile & tablet: stack everything in a single column */}
          {/* For desktop: maintain original grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
            {/* Feature Image - Full width on mobile/tablet */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-3 relative h-[300px] md:h-[400px] lg:min-h-[700px]">
              <Image
                src="/pexels-sound-on-3756848.jpg"
                alt="feature1"
                fill
                className="object-cover rounded-xl border border-gray-500"
              />
            </div>

            {/* Main Feature Text - Full width on mobile/tablet */}
            <div
              className="col-span-1 md:col-span-1 lg:col-start-3 lg:col-span-3 lg:row-span-3 relative 
                          rounded-xl bg-[#FCFCFE1A] border border-gray-500
                          h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[700px]"
            >
              <div className="text-white p-6 md:p-10 lg:p-16">
                <p className="text-white font-bold flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                  No App download required
                </p>
                <h1 className="text-3xl md:text-4xl  xl:text-7xl font-bold uppercase my-4 md:my-6 lg:my-10 font-ghotic tracking-widest">
                  Personalize for Your Event
                </h1>
                <p
                  className="text-sm  lg:text-xl font-semibold text-[#FCFCFE99] tracking-widest 
                             mr-0 md:mr-20 lg:mr-48"
                >
                  choose how many photos guests should take, decide when the
                  photos reveal, and more!
                </p>
                <button
                  className="font-ghotic mt-8 md:mt-12 lg:mt-20 text-sm md:text-lg lg:text-xl text-[#FCFCFe] uppercase 
                                 flex items-center gap-2 lg:gap-5 
                                 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 
                                 py-1 px-2 md:px-3 lg:px-4 md:py-1 lg:py-2 font-bold rounded-full"
                >
                  Create Event
                  <FaCamera />
                </button>
              </div>
            </div>

            {/* QR Code Templates - Full width on mobile/tablet */}
            <div
              className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-start-4 lg:row-span-2 
                          relative h-auto h-[240px] md:h-[240px]
                          bg-[#FCFCFE1A] border border-gray-500 rounded-xl overflow-hidden p-4 md:p-6"
            >
              <div className="flex flex-col items-center justify-between h-full md:flex-row">
                {/* Text Content - Full width on mobile, Left Side on larger */}
                <div className="w-full md:w-3/5 pr-0 md:pr-4 mb-4 md:mb-0">
                  <h1 className="text-xl font-bold text-white mb-2">
                    QR CODE TEMPLATES
                  </h1>
                  <p className="text-sm text-[#FCFCFE99] font-semibold tracking-widest">
                    Each PXF event has a unique QR code that participants can
                    scan to join. Choose between one of the pre-styled templates
                    or design your own.
                  </p>
                </div>

                {/* Image - Bottom on mobile, Right Side on larger */}
                <div className="w-full md:w-2/5 relative h-[160px] md:h-[180px]">
                  <div className="relative w-full h-full">
                    <Image
                      src="/pxf.png"
                      alt="QR code templates"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PXF Sharing Blocks - Full width on mobile/tablet */}
            <div
              className="col-span-1 md:col-span-1 lg:col-start-4 lg:col-span-2 lg:row-start-4 lg:row-span-2 
                          relative h-[240px] md:h-[240px]
                          bg-[#FCFCFE1A] rounded-xl overflow-hidden border border-gray-500"
            >
              {/* Background image */}
              <div className="relative w-full h-full">
                <Image
                  src="/pov.png"
                  alt="feature4"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>

              {/* Text content with overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-10 pb-4 px-4 md:px-5">
                <h1 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                  PXF SHARING BLOCKS
                </h1>
                <p className="text-sm text-[#FCFCFE99] font-semibold tracking-widest">
                  The easiest way to share your PXF Camera with your guests.
                  Guests hold their phone over the block to magically pull up
                  your event&apos;s PXF Camera.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
