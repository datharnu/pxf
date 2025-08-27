"use client";

import BriefcaseIcon from "@/components/icons/briefcase";
import ChurchIcon from "@/components/icons/church";
import ClubIcon from "@/components/icons/club";
import ConcertIcon from "@/components/icons/concert";
import ConferenceIcon from "@/components/icons/conference";
import HangoutIcon from "@/components/icons/hangout";
import SportIcon from "@/components/icons/sport";
import WeddingPartyIcon from "@/components/icons/weeding";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";

const eventSlides = [
  {
    title: "company party,",
    icon: <BriefcaseIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/company-party.jpg",
    quote:
      "I first discovered PXF at a wedding and instantly knew it had to be part of our company events.",
    author: "— Marketing Manager at Rentville",
  },
  {
    title: "conference,",
    icon: <ConferenceIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/conference.jpg",
    quote:
      "PXF brought a whole new dimension to our conference — attendees were engaged like never before.",
    author: "— Head of Events, Tech Summit",
  },
  {
    title: "concert,",
    icon: <ConcertIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/concert1.jpg",
    quote:
      "PXF turned our concert into a multi-angle experience — fans felt like they were on stage!",
    author: "— Concert Director",
  },
  {
    title: "club,",
    icon: <ClubIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/club.jpg",
    quote:
      "We used PXF for a club event and it captured the energy, lights, and vibe perfectly.",
    author: "— Nightlife Event Coordinator",
  },
  {
    title: "school,",
    icon: <HangoutIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/school.jpg",
    quote:
      "Our students loved using PXF — it made our school events feel dynamic and exciting.",
    author: "— School Activities Director",
  },
  {
    title: "wedding party,",
    icon: <WeddingPartyIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/wedding-party.jpg",
    quote:
      "PXF helped us relive our wedding from every angle — it felt like experiencing it all over again.",
    author: "— Newlywed Couple",
  },
  {
    title: "church, or",
    icon: <ChurchIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/church1.jpg",
    quote:
      "From sermons to celebrations, PXF made our church event unforgettable and heartfelt.",
    author: "— Worship Experience Leader",
  },
  {
    title: "gym and more....",
    icon: <SportIcon className="w-6 h-6 lg:w-10 lg:h-10" />,
    image: "/gym1.jpg",
    quote:
      "Using PXF at our gym gave clients a new way to see progress and celebrate their fitness journey.",
    author: "— Fitness Coach",
  },
];

export default function EventSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSelect = (index: number) => {
    setCurrentSlide(index);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + eventSlides.length) % eventSlides.length
    );
  };

  // Auto-advance slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = eventSlides[currentSlide];

  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-110"
        style={{ backgroundImage: `url(${current.image})` }}
      />

      {/* Black overlay extended up a bit more */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10  mt-24">
        <div className="z-10 flex gap-5 justify-center lg:gap-16 h-full px-4 md:px-16">
          {/* Phone Mockup */}
          <div className="">
            <div className="lg:w-[270px] lg:h-[560px] w-[180px] h-[380px] rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-black bg-black">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-xl -mt-5 lg:text-left">
            <h2 className="lg:text-4xl text-xl highway-ghotic font-bold mb-3 lg:mb-6">
              Capture every perspective at your:
            </h2>

            <div className="flex flex-col lg:flex-wrap lg:max-h-96 lg:content-start mb-6">
              {eventSlides.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <div
                    key={index}
                    onClick={() => handleSelect(index)}
                    className="cursor-pointer py-1 lg:mr-6 lg:mb-3 rounded-lg highway-ghotic font-semibold text-lg lg:text-2xl transition-all flex items-center gap-2 lg:w-auto"
                  >
                    {/* Icon */}
                    <span
                      className={`text-xl lg:block ${
                        isActive ? "text-[#5756CE]" : "text-[#FCFCFE99]"
                      }`}
                    >
                      {slide.icon}
                    </span>

                    {/* Title */}
                    <span
                      className={
                        isActive
                          ? "border-b-[3px] border-[#5756CE] text-white"
                          : "text-[#FCFCFE99]"
                      }
                    >
                      {slide.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <>
              <Link
                href="/create-event"
                className="font-ghotic lg:w-[220px] w-[180px] lg:mt-10 lg:text-xl text-lg highway-ghotic flex items-center lg:gap-5 gap-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500  py-1 px-1 pl-2 lg:px-2 lg:py-2 lg:pl-4 font-bold rounded-full "
              >
                Create an Event
                <div className=" rounded-full lg:px-2 lg:py-2 px-1 py-1">
                  <ArrowRight className=" text-white lg:size-5 size-4 " />
                </div>
              </Link>
            </>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative mt-20 px-6 lg:px-14 max-w-4xl mx-3 ">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 lg:bg-white/20 lg:hover:bg-white/40 text-white p-3 rounded-full lg:backdrop-blur-sm transition"
              aria-label="Previous Slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Quote Content */}
            <div className="flex flex-col text-center justify-center px-5 md:px-20">
              <p className="italic text-lg md:text-2xl lg:text-3xl highway-ghotic font-semibold decoration-white decoration-2 mb-2">
                <span className="text-[#FCFCFE99] font-bold text-3xl md:text-4xl">
                  “{" "}
                </span>
                {current.quote}
                <span className="text-[#FCFCFE99] font-bold text-3xl md:text-4xl">
                  {" "}
                  ”
                </span>
              </p>
              <p className="text-xs lg:text-sm font-bold text-[#FCFCFE99]">
                {current.author}
              </p>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 lg:bg-white/20 hover:bg-white/40 text-white p-3 rounded-full lg:backdrop-blur-sm transition"
              aria-label="Next Slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
