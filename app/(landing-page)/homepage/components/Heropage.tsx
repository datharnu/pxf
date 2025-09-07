"use client";
import React, { useEffect, useState } from "react";
import { useAnimation } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { ArrowRight } from "lucide-react";
import { QRCodeScanner } from "@/app/my-events/components/qrcode";
import { useRouter } from "next/navigation";

// Replace these with your actual image paths
// Array for first column (moving up)
const imageArray1 = ["/pic2.jpg", "/pic3.jpg", "/pic4.jpg", "/pic5.jpg"];

// Array for second column (moving down)
const imageArray2 = ["/pic1.jpg", "/pic6.jpg", "/pic7.jpg", "/pic8.jpg"];

export default function SectionWithCarousel() {
  const router = useRouter();
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);

  useEffect(() => {
    // First carousel - moving up
    controls1.start({
      y: "-100%",
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });

    // Second carousel - moving down
    controls2.start({
      y: "100%",
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });

    // Pause animation on hover
    return () => {
      controls1.stop();
      controls2.stop();
    };
  }, [controls1, controls2]);

  const handleQRScan = (data: string): void => {
    console.log("Scanned QR:", data);
    setShowQRScanner(false);

    // Process the QR code data
    // For example, if it's an event URL, navigate to it
    if (data.includes("/event/")) {
      router.push(data.replace(window.location.origin, ""));
    }
  };

  return (
    <div className="bg-primary pb-10 lg:min-h-fit bg-[url('/Footer.svg')] bg-contain bg-no-repeat lg:p-5 p-3">
      <Navbar
        onJoinEvent={() => setShowQRScanner(true)}
        showJoinButton={true}
      />
      {/* QR Code Scanner Component */}
      <QRCodeScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />

      <div className="flex justify-center   ">
        <div className="flex flex-col md:flex-row justify-between  items-center mx-4 md:mx-12 lg:mx-32 my-20 max-w-[90rem] w-full px-2">
          <div className="text-white w-full   md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
            <h1 className="lg:text-4xl text-3xl font-bold highway-ghotic uppercase mb-6 font-ghotic ">
              Share Event Photos Easily
            </h1>
            <p className="lg:text-sm xl:text-lg leading-relaxed ">
              With Memoria, your guests can instantly join your album by simply
              clicking a link or scanning a QR code no apps to download, no
              accounts to create. Every photo and video they capture is
              collected in one beautiful digital album, giving you the chance to
              relive your event through everyone’s eyes. Simple for guests,
              priceless for memories.
            </p>

            <button
              onClick={() => (window.location.href = "/create-event")}
              className="font-ghotic cursor-pointer mt-10 lg:text-lg text-sm uppercase flex items-center lg:gap-5 gap-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500  py-1 px-1 pl-2 lg:px-2 lg:py-2 lg:pl-4 font-bold rounded-full "
            >
              Create a Memoria Event
              <div className="bg-white rounded-full lg:px-2 lg:py-2 px-1 py-1">
                <ArrowRight className=" text-black lg:size-5 size-4 " />
              </div>
            </button>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="flex gap-4 lg:h-[500px] h-[300px] relative overflow-hidden">
              {/* First column - Going up */}
              <div className="w-40 lg:w-72 h-full relative overflow-hidden rounded-xl">
                <div className="absolute top-0 left-0 w-full scroll-up pause-on-hover">
                  {[...imageArray1, ...imageArray1].map((image, index) => (
                    <div
                      key={`up-${index}`}
                      className="w-full h-40 sm:h-48 md:h-64 mb-4 relative overflow-hidden rounded-xl shadow-lg"
                    >
                      <Image
                        src={image}
                        alt={`Event photo ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Second column - Going down */}
              <div className="w-48 lg:w-72 h-full relative overflow-hidden rounded-xl">
                <div className="w-48 lg:w-72 h-full relative overflow-hidden rounded-xl">
                  <div className="absolute bottom-0 left-0 w-full scroll-down pause-on-hover">
                    {[...imageArray2, ...imageArray2].map((image, index) => (
                      <div
                        key={`down-${index}`}
                        className="w-full h-64 mb-4 relative overflow-hidden rounded-xl shadow-lg"
                      >
                        <Image
                          src={image}
                          alt={`Event photo ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="  text-white lg:hidden flex items-center mx-6 gap-5 text-xs font-semibold ">
        <p> Quality Images</p>
        <p> Professional Photography</p>
        <p className="font-bold"> 100% Free</p>
      </div>
    </div>
  );
}
