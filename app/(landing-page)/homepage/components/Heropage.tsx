// "use client";
// import React, { useEffect, useState } from "react";
// import { useAnimation } from "framer-motion";
// import Image from "next/image";
// import Navbar from "@/components/shared/Navbar";
// import { ArrowRight } from "lucide-react";
// import { QRCodeScanner } from "@/app/my-events/components/qrcode";
// import { useRouter } from "next/navigation";

// // Replace these with your actual image paths
// // Array for first column (moving up)
// const imageArray1 = ["/pic2.jpg", "/pic3.jpg", "/pic4.jpg", "/pic5.jpg"];

// // Array for second column (moving down)
// const imageArray2 = ["/pic1.jpg", "/pic6.jpg", "/pic7.jpg", "/pic8.jpg"];

// export default function SectionWithCarousel() {
//   const router = useRouter();
//   const controls1 = useAnimation();
//   const controls2 = useAnimation();

//   const [showQRScanner, setShowQRScanner] = useState<boolean>(false);

//   useEffect(() => {
//     // First carousel - moving up
//     controls1.start({
//       y: "-100%",
//       transition: {
//         duration: 25,
//         ease: "linear",
//         repeat: Infinity,
//         repeatType: "loop",
//       },
//     });

//     // Second carousel - moving down
//     controls2.start({
//       y: "100%",
//       transition: {
//         duration: 25,
//         ease: "linear",
//         repeat: Infinity,
//         repeatType: "loop",
//       },
//     });

//     // Pause animation on hover
//     return () => {
//       controls1.stop();
//       controls2.stop();
//     };
//   }, [controls1, controls2]);

//   const handleQRScan = (data: string): void => {
//     console.log("Scanned QR:", data);
//     setShowQRScanner(false);

//     // Process the QR code data
//     // For example, if it's an event URL, navigate to it
//     if (data.includes("/event/")) {
//       router.push(data.replace(window.location.origin, ""));
//     }
//   };

//   return (
//     <div className="bg-primary pb-10 lg:min-h-fit bg-[url('/Footer.svg')] bg-contain bg-no-repeat lg:p-5 p-3">
//       <Navbar
//         onJoinEvent={() => setShowQRScanner(true)}
//         showJoinButton={true}
//       />
//       {/* QR Code Scanner Component */}
//       <QRCodeScanner
//         isOpen={showQRScanner}
//         onClose={() => setShowQRScanner(false)}
//         onScan={handleQRScan}
//       />

//       <div className="flex justify-center   ">
//         <div className="flex flex-col md:flex-row justify-between  items-center mx-4 md:mx-12 lg:mx-32 my-20 max-w-[90rem] w-full px-2">
//           <div className="text-white w-full   md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
//             <h1 className="lg:text-4xl text-3xl font-bold highway-ghotic uppercase mb-6 font-ghotic ">
//               Share Event Photos Easily
//             </h1>
//             <p className="lg:text-sm xl:text-lg leading-relaxed ">
//               With Picha, guests join your event through a link or QR code no
//               apps, no accounts. All photos and videos in one place, memories
//               easy to share.
//             </p>

//             <button
//               onClick={() => (window.location.href = "/create-event")}
//               className="font-ghotic  cursor-pointer mt-10 lg:text-lg text-sm  flex items-center lg:gap-5 gap-2
//               bg-gradient-to-r to-[#FF851C]  from-[#270D01]  py-2 px-2 pl-2 lg:px-2 lg:py-2 lg:pl-4 font-bold rounded-full "
//             >
//               Create a PICHA Event
//               <div className="bg-white rounded-full lg:px-2 lg:py-2 px-1 py-1">
//                 <ArrowRight className=" text-black lg:size-5 size-4 " />
//               </div>
//             </button>
//           </div>

//           <div className="w-full md:w-1/2 flex justify-center">
//             <div className="flex gap-4 lg:h-[500px] h-[300px] relative overflow-hidden">
//               {/* First column - Going up */}
//               <div className="w-40 lg:w-72 h-full relative overflow-hidden rounded-xl">
//                 <div className="absolute top-0 left-0 w-full scroll-up pause-on-hover">
//                   {[...imageArray1, ...imageArray1].map((image, index) => (
//                     <div
//                       key={`up-${index}`}
//                       className="w-full h-40 sm:h-48 md:h-64 mb-4 relative overflow-hidden rounded-xl shadow-lg"
//                     >
//                       <Image
//                         src={image}
//                         alt={`Event photo ${index + 1}`}
//                         fill
//                         sizes="(max-width: 768px) 100vw, 33vw"
//                         className="object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Second column - Going down */}
//               <div className="w-48 lg:w-72 h-full relative overflow-hidden rounded-xl">
//                 <div className="w-48 lg:w-72 h-full relative overflow-hidden rounded-xl">
//                   <div className="absolute bottom-0 left-0 w-full scroll-down pause-on-hover">
//                     {[...imageArray2, ...imageArray2].map((image, index) => (
//                       <div
//                         key={`down-${index}`}
//                         className="w-full h-64 mb-4 relative overflow-hidden rounded-xl shadow-lg"
//                       >
//                         <Image
//                           src={image}
//                           alt={`Event photo ${index + 1}`}
//                           fill
//                           sizes="(max-width: 768px) 100vw, 33vw"
//                           className="object-cover"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="  text-white lg:hidden flex items-center mx-6 gap-5 text-xs font-semibold ">
//         <p> Quality Images</p>
//         <p> Professional Photography</p>
//         <p className="font-bold"> 100% Free</p>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { useAnimation, motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { ArrowRight } from "lucide-react";
import { QRCodeScanner } from "@/app/my-events/components/qrcode";
import { useRouter } from "next/navigation";

// Modern rotating content with better structure
const rotatingContent = [
  {
    preText: "Share Event Photos",
    mainText: "Easily",
    description:
      "Guests join through QR codes - no apps, no accounts. All photos in one place.",
    highlight: "100% Free",
    color: "from-orange-500 to-red-500",
  },
  {
    preText: "Wedding Photo",
    mainText: "Galleries",
    description:
      "Perfect for ceremonies and receptions. Beautiful collaborative albums.",
    highlight: "For Weddings",
    color: "from-pink-500 to-purple-500",
  },
  {
    preText: "Corporate Event",
    mainText: "Platform",
    description:
      "Professional photo sharing for conferences, meetings, and team events.",
    highlight: "For Business",
    color: "from-blue-500 to-indigo-500",
  },
  {
    preText: "Party & Celebration",
    mainText: "Memories",
    description:
      "Birthdays, graduations, and parties become unforgettable experiences.",
    highlight: "For Fun",
    color: "from-green-500 to-teal-500",
  },
];

const imageArray1 = ["/pic2.jpg", "/pic3.jpg", "/pic4.jpg", "/pic5.jpg"];
const imageArray2 = ["/pic1.jpg", "/pic6.jpg", "/pic7.jpg", "/pic8.jpg"];

const imageAltTexts = [
  "Event photo sharing with QR code",
  "Wedding guests uploading photos",
  "Corporate event photo gallery",
  "Party photo sharing platform",
  "Conference photo upload system",
  "Social gathering photo collection",
  "Professional event photography",
  "Group celebration photo sharing",
];

export default function SectionWithCarousel() {
  const router = useRouter();
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Auto-rotate content every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContentIndex((prev) => (prev + 1) % rotatingContent.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      controls1.start({
        y: "-100%",
        transition: {
          duration: 25,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });

      controls2.start({
        y: "100%",
        transition: {
          duration: 25,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    }

    return () => {
      isMounted = false;
      controls1.stop();
      controls2.stop();
    };
  }, [controls1, controls2]);

  const handleQRScan = (data: string): void => {
    console.log("Scanned QR:", data);
    setShowQRScanner(false);

    if (data.includes("/event/")) {
      router.push(data.replace(window.location.origin, ""));
    }
  };

  const currentContent = rotatingContent[currentContentIndex];

  return (
    <div className="bg-primary pb- lg:min-h-fit bg-[url('/Footer.svg')] bg-contain bg-no-repeat lg:p-5 p-3">
      <Navbar
        onJoinEvent={() => setShowQRScanner(true)}
        showJoinButton={true}
      />

      <QRCodeScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />

      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row justify-between items-center mx-4 md:mx-12 lg:mx-32 my-20 max-w-[90rem] w-full px-2">
          {/* Modern Animated Hero Content */}
          <div className="text-white w-full md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0 relative">
            {/* Animated Heading */}
            <div className="mb-6 relative h-[120px] lg:h-[160px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentContentIndex}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <h1 className="lg:text-4xl text-3xl font-bold font-ghotic uppercase leading-tight">
                    <span className="text-gray-300 text-2xl lg:text-3xl block">
                      {currentContent.preText}
                    </span>
                    <span
                      className={`text-5xl lg:text-7xl bg-gradient-to-r ${currentContent.color} bg-clip-text text-transparent font-extrabold block`}
                    >
                      {currentContent.mainText}
                    </span>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated Description */}
            <div className="mb-8 relative h-[60px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentContentIndex}`}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:text-lg text-base leading-relaxed text-gray-200"
                >
                  {currentContent.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Animated Highlight Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`highlight-${currentContentIndex}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mb-8"
              >
                <span
                  className={`inline-block px-4 py-2 rounded-full text-white font-bold text-sm bg-gradient-to-r ${currentContent.color} shadow-lg`}
                >
                  {currentContent.highlight}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* CTA Button */}
            <motion.button
              onClick={() => (window.location.href = "/create-event")}
              className="font-ghotic cursor-pointer lg:text-lg text-sm flex items-center lg:gap-5 gap-2 
              bg-gradient-to-r to-[#FF851C] from-[#270D01] py-3 px-4 lg:px-6 lg:py-4 font-bold rounded-full 
              hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Create a PICHA Event
              <div className="bg-white rounded-full p-2 group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight className="text-black lg:size-5 size-4" />
              </div>
            </motion.button>

            {/* Modern Progress Indicators */}
            <div className="flex gap-3 mt-8">
              {rotatingContent.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentContentIndex
                      ? `bg-gradient-to-r ${currentContent.color} w-8`
                      : "bg-gray-600 w-4 hover:bg-gray-500"
                  }`}
                  onClick={() => setCurrentContentIndex(index)}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>
          </div>

          {/* Image Carousel (Enhanced with subtle animations) */}
          <div className="w-full md:w-1/2 mt-10 flex justify-center">
            <motion.div
              className="flex gap-4 lg:h-[500px] h-[300px] relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* First column - Going up */}
              <div className="w-40 lg:w-72 h-full relative overflow-hidden rounded-xl">
                <div className="absolute top-0 left-0 w-full scroll-up pause-on-hover">
                  {[...imageArray1, ...imageArray1].map((image, index) => (
                    <motion.div
                      key={`up-${index}`}
                      className="w-full h-40 sm:h-48 md:h-64 mb-4 relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Image
                        src={image}
                        alt={imageAltTexts[index % imageAltTexts.length]}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Second column - Going down */}
              <div className="w-48 lg:w-72 h-full  relative overflow-hidden rounded-xl">
                <div className="w-48 lg:w-72 h-full relative overflow-hidden rounded-xl">
                  <div className="absolute bottom-0 left-0 w-full scroll-down pause-on-hover">
                    {[...imageArray2, ...imageArray2].map((image, index) => (
                      <motion.div
                        key={`down-${index}`}
                        className="w-full h-64 mb-4 relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Image
                          src={image}
                          alt={
                            imageAltTexts[(index + 4) % imageAltTexts.length]
                          }
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hidden on mobile - not needed with new design */}
    </div>
  );
}
