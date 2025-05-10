"use client";
import React, { useEffect } from "react";
import { useAnimation } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import { ArrowRight } from "lucide-react";

// Replace these with your actual image paths
// Array for first column (moving up)
const imageArray1 = ["/pic2.jpg", "/pic3.jpg", "/pic4.jpg", "/pic5.jpg"];

// Array for second column (moving down)
const imageArray2 = ["/pic1.jpg", "/pic6.jpg", "/pic7.jpg", "/pic8.jpg"];

export default function SectionWithCarousel() {
  const controls1 = useAnimation();
  const controls2 = useAnimation();

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

  return (
    <div className="bg-primary min-h-screen lg:min-h-fit bg-[url('/Footer.svg')] bg-contain bg-no-repeat lg:p-5 p-3">
      <Navbar />
      <div className="flex justify-center   ">
        <div className="flex flex-col md:flex-row justify-between  items-center mx-4 md:mx-12 lg:mx-32 my-20 max-w-[90rem] w-full px-2">
          <div className="text-white w-full   md:w-1/2 pr-0 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-3xl font-bold uppercase mb-6 font-ghotic ">
              A camera to capture every perspective
            </h1>
            <p className="lg:text-sm xl:text-lg leading-relaxed ">
              Remember those weddings where the host would leave a disposable
              camera on each table? POV is today&apos;s version, but not just
              for weddings. It&apos;s perfect for parties, nights out, concerts,
              sporting events, clubs, and more. No app download is required to
              participate.
            </p>

            <button className="font-ghotic mt-10 lg:text-lg text-sm uppercase flex items-center lg:gap-5 gap-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500  py-1 px-1 pl-2 lg:px-2 lg:py-2 lg:pl-4 font-bold rounded-full ">
              Create a POV Camera
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
