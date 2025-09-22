/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import Image from "next/image";
// import React from "react";
// import Partners from "./Partners";
// import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
// import { FaCamera } from "react-icons/fa";

// export default function Features() {
//   return (
//     <div className="bg-primary ">
//       <div className="lg:flex justify-center">
//         <Partners />
//       </div>
//       <div className="flex justify-center">
//         <div className="w-full mx-4 md:mx-8 lg:mx-32 my-8 md:my-12  max-w-7xl">
//           {/* For mobile & tablet: stack everything in a single column */}
//           {/* For desktop: maintain original grid layout */}
//           <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
//             {/* Hero Video Background - Full width on mobile/tablet */}
//             <div className="col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-3 relative h-[300px] md:h-[400px] lg:min-h-[700px] overflow-hidden rounded-xl border border-gray-500">
//               <video
//                 src="/videoHero.mp4"
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className="absolute inset-0 w-full h-full object-cover z-0"
//                 style={{ objectFit: "cover" }}
//               />
//               {/* Light overlay for better text readability */}
//               <div className="absolute inset-0 bg-black/10 bg-opacity-10 z-10"></div>

//               {/* Hero content overlay */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8 lg:p-12 z-20">
//                 <div className="flex items-center gap-4  mb-4 md:mb-6">
//                   <Image
//                     src={"/picha-logo.png"}
//                     alt="logo"
//                     width={100}
//                     height={100}
//                     className=""
//                   />
//                   <div className="mb-4 md:mb-6 lg:mb-8">
//                     <FaCamera className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white mx-auto mb-4" />
//                   </div>
//                 </div>

//                 <p className="text-sm md:text-base lg:text-lg text-white font-medium max-w-md md:max-w-lg lg:max-w-xl tracking-wide leading-relaxed">
//                   Create unforgettable events where guests share their
//                   perspective through photos and videos
//                 </p>
//               </div>
//             </div>

//             {/* Main Feature Text - Full width on mobile/tablet */}
//             <div
//               className="col-span-1 md:col-span-1 lg:col-start-3 lg:col-span-3 lg:row-span-3 relative
//                           rounded-xl bg-[#FCFCFE1A] border border-gray-500
//                           h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[700px]"
//             >
//               <div className="text-white p-6 md:p-10 lg:p-16">
//                 <p className="text-white font-bold flex items-center gap-2">
//                   <DevicePhoneMobileIcon className="w-5 h-5" />
//                   No App download required
//                 </p>
//                 <h1 className="text-3xl md:text-4xl  xl:text-7xl font-bold uppercase my-4 md:my-6 lg:my-10 font-ghotic tracking-widest">
//                   Personalize for Your Event
//                 </h1>
//                 <p
//                   className="text-sm  lg:text-xl font-semibold text-[#FCFCFE99] tracking-widest
//                              mr-0 md:mr-20 lg:mr-48"
//                 >
//                   choose how many photos guests should take, decide when the
//                   photos reveal, and more!
//                 </p>
//                 <button
//                   onClick={() => (window.location.href = "/create-event")}
//                   className="mt-6 md:mt-8 lg:mt-10 font-ghotic text-sm md:text-base lg:text-lg text-white uppercase
//                              flex items-center gap-2 lg:gap-3
//                              bg-gradient-to-r to-[#FF851C]  from-[#270D01]
//                              py-2 px-4 md:px-6 lg:px-8 font-bold rounded-full cursor-pointer hover:scale-105 transition-transform"
//                 >
//                   Create Your Event
//                   <FaCamera className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* QR Code Templates - Full width on mobile/tablet */}
//             <div
//               className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-start-4 lg:row-span-2
//                           relative h-auto h-[240px] md:h-[240px]
//                           bg-[#FCFCFE1A] border border-gray-500 rounded-xl overflow-hidden p-4 md:p-6"
//             >
//               <div className="flex flex-col items-center justify-between h-full md:flex-row">
//                 {/* Text Content - Full width on mobile, Left Side on larger */}
//                 <div className="w-full md:w-3/5 pr-0 md:pr-4 mb-4 md:mb-0">
//                   <h1 className="text-xl font-bold text-white mb-2">
//                     QR CODE TEMPLATES
//                   </h1>
//                   <p className="text-sm text-[#FCFCFE99] font-semibold tracking-widest">
//                     Each PICHA event has a unique QR code that participants can
//                     scan to join. Choose between one of the pre-styled templates
//                     or design your own.
//                   </p>
//                 </div>

//                 {/* Image - Bottom on mobile, Right Side on larger */}
//                 <div className="w-full md:w-2/5 relative h-[160px] md:h-[180px]">
//                   <div className="relative w-full h-full">
//                     <Image
//                       src="/pxf.png"
//                       alt="QR code templates"
//                       fill
//                       className="object-contain"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* PXF Sharing Blocks - Full width on mobile/tablet */}
//             <div
//               className="col-span-1 md:col-span-1 lg:col-start-4 lg:col-span-2 lg:row-start-4 lg:row-span-2
//                           relative h-[240px] md:h-[240px]
//                           bg-[#FCFCFE1A] rounded-xl overflow-hidden border border-gray-500"
//             >
//               {/* Background image */}
//               <div className="relative w-full h-full">
//                 <Image
//                   src="/pov.png"
//                   alt="feature4"
//                   fill
//                   objectFit="cover"
//                   className="rounded-lg"
//                 />
//               </div>

//               {/* Text content with overlay */}
//               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-10 pb-4 px-4 md:px-5">
//                 <h1 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
//                   PICHA SHARING BLOCKS
//                 </h1>
//                 <p className="text-sm text-[#FCFCFE99] font-semibold tracking-widest">
//                   The easiest way to share your PICHA Camera with your guests.
//                   Guests hold their phone over the block to magically pull up
//                   your event&apos;s PICHA Camera.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import Partners from "./Partners";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { FaCamera, FaQrcode, FaShareAlt, FaPalette } from "react-icons/fa";
import { motion, useInView, useAnimation } from "framer-motion";

export default function Features() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const mainFeatureRef = useRef(null);
  const qrRef = useRef(null);
  const sharingRef = useRef(null);

  const isVideoInView = useInView(videoRef, { once: true, margin: "-100px" });
  const isMainInView = useInView(mainFeatureRef, {
    once: true,
    margin: "-100px",
  });
  const isQrInView = useInView(qrRef, { once: true, margin: "-100px" });
  const isSharingInView = useInView(sharingRef, {
    once: true,
    margin: "-100px",
  });

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="bg-primary">
      <div className="lg:flex justify-center">
        <Partners />
      </div>

      <div className="flex justify-center" ref={containerRef}>
        <div className="w-full mx-4 md:mx-8 lg:mx-32 my-8 md:my-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
            {/* Animated Video Hero Background */}
            <motion.div
              ref={videoRef}
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={
                isVideoInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-3 relative h-[300px] md:h-[400px] lg:min-h-[700px] overflow-hidden rounded-xl border border-gray-500/30 group cursor-pointer"
              onMouseEnter={() => setHoveredCard("video")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.video
                src="/videoHero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700"
                style={{ objectFit: "cover" }}
                animate={{ scale: hoveredCard === "video" ? 1.05 : 1 }}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-[#270D01]/40 z-10"></div>

              {/* Animated Overlay Content */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8 lg:p-12 z-20"
                animate={{ y: hoveredCard === "video" ? -5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-center gap-4 mb-4 md:mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVideoInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Image
                    src="/picha-logo.png"
                    alt="Picha Event Photo Sharing"
                    width={100}
                    height={100}
                    className="drop-shadow-2xl"
                  />
                  <motion.div
                    className="mb-4 md:mb-6 lg:mb-8"
                    animate={{ rotate: hoveredCard === "video" ? 15 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaCamera className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white mx-auto mb-4 drop-shadow-lg" />
                  </motion.div>
                </motion.div>

                <motion.p
                  className="text-sm md:text-base lg:text-lg text-white font-medium max-w-md md:max-w-lg lg:max-w-xl tracking-wide leading-relaxed drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVideoInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Transform events into collaborative experiences where every
                  guest becomes a photographer
                </motion.p>
              </motion.div>

              {/* Hover Effect Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#FF851C]/20 via-transparent to-amber-600/20 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === "video" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Animated Main Feature */}
            <motion.div
              ref={mainFeatureRef}
              initial={{ opacity: 0, x: 10 }}
              animate={isMainInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-1 md:col-span-1 lg:col-start-3 lg:col-span-3 lg:row-span-3 relative 
                          rounded-xl bg-gradient-to-br from-[#FCFCFE1A] via-[#FCFCFE0A] to-transparent border border-gray-500/30
                          h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[700px] group cursor-pointer backdrop-blur-sm"
              onMouseEnter={() => setHoveredCard("main")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-white p-6 md:p-10 lg:p-16 relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={isMainInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="p-2 bg-gradient-to-r from-[#FF851C] to-amber-500 rounded-full">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-black font-bold" />
                  </div>
                  <span className="text-white font-bold bg-gradient-to-r from-[#FF851C] to-amber-400 bg-clip-text text-transparent">
                    No App Download Required
                  </span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl xl:text-7xl font-bold uppercase my-4 md:my-6 lg:my-10 font-ghotic tracking-widest"
                  initial={{ y: 30, opacity: 0 }}
                  animate={isMainInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <span className="bg-gradient-to-r from-[#FF851C] via-amber-500 to-amber-400 bg-clip-text text-transparent">
                    Personalize
                  </span>
                  <br />
                  <span className="text-white">for Your Event</span>
                </motion.h2>

                <motion.p
                  className="text-sm lg:text-xl font-semibold text-[#FCFCFE99] tracking-wide mr-0 md:mr-20 lg:mr-48 mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isMainInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Set photo limits, control reveal timing, and customize
                  settings for any event type.
                </motion.p>

                <motion.button
                  onClick={() => (window.location.href = "/create-event")}
                  className="font-ghotic text-sm md:text-base lg:text-lg text-white uppercase 
                             flex items-center gap-2 lg:gap-3 
                             bg-gradient-to-r from-[#270D01] via-[#FF851C] to-amber-600
                             py-3 px-6 md:px-8 lg:px-10 font-bold rounded-full cursor-pointer 
                             shadow-2xl hover:shadow-[#FF851C]/25 transition-all duration-300 group/btn"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isMainInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Your Event
                  <motion.div
                    animate={{ rotate: hoveredCard === "main" ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaCamera className="w-4 h-4 group-hover/btn:drop-shadow-lg" />
                  </motion.div>
                </motion.button>
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-full"></div>
              </div>
            </motion.div>

            {/* Animated QR Code Templates */}
            <motion.div
              ref={qrRef}
              initial={{ opacity: 0, y: 50 }}
              animate={isQrInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-start-4 lg:row-span-2 
                          relative h-auto h-[240px] md:h-[240px]
                          bg-gradient-to-br from-[#FCFCFE1A] via-[#FCFCFE0A] to-transparent border border-gray-500/30 
                          rounded-xl overflow-hidden p-4 md:p-6 group cursor-pointer backdrop-blur-sm"
              onMouseEnter={() => setHoveredCard("qr")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex flex-col items-center justify-between h-full md:flex-row">
                <div className="w-full md:w-3/5 pr-0 md:pr-4 mb-4 md:mb-0">
                  <motion.div
                    className="flex items-center gap-3 mb-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={isQrInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full">
                      <FaQrcode className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                      QR Code Templates
                    </h3>
                  </motion.div>

                  <motion.p
                    className="text-sm text-[#FCFCFE99] font-semibold tracking-wide"
                    initial={{ x: -20, opacity: 0 }}
                    animate={isQrInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    Each event gets a unique QR code. Choose from styled
                    templates or design your own.
                  </motion.p>
                </div>

                <motion.div
                  className="w-full md:w-2/5 relative h-[160px] md:h-[180px]"
                  initial={{ x: 50, opacity: 0, scale: 0.8 }}
                  animate={isQrInView ? { x: 0, opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/pxf.png"
                      alt="QR code templates for events"
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FF851C]/10 to-amber-500/10 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === "qr" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Animated Sharing Blocks */}
            <motion.div
              ref={sharingRef}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              animate={isSharingInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="col-span-1 md:col-span-1 lg:col-start-4 lg:col-span-2 lg:row-start-4 lg:row-span-2 
                          relative h-[240px] md:h-[240px]
                          bg-gradient-to-br from-[#FCFCFE1A] via-[#FCFCFE0A] to-transparent rounded-xl 
                          overflow-hidden border border-gray-500/30 group cursor-pointer backdrop-blur-sm"
              onMouseEnter={() => setHoveredCard("sharing")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ scale: hoveredCard === "sharing" ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/pov.png"
                  alt="Physical QR sharing displays"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-4 px-4 md:px-5">
                <motion.div
                  className="flex items-center gap-3 mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isSharingInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="p-2 bg-gradient-to-r from-[#270D01] to-[#FF851C] rounded-full">
                    <FaShareAlt className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#FF851C] to-amber-400 bg-clip-text text-transparent">
                    Physical Displays
                  </h3>
                </motion.div>

                <motion.p
                  className="text-sm text-[#FCFCFE99] font-semibold tracking-wide"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isSharingInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Print QR codes for your venue. Guests scan to instantly join
                  your event gallery.
                </motion.p>
              </div>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#270D01]/30 to-[#FF851C]/20 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === "sharing" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
