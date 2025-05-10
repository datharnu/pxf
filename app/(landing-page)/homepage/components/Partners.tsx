import React from "react";

interface Partner {
  name?: string;
  logo: string;
}

const partners: Partner[] = [
  {
    name: "Google Photos",
    logo: "/google-photos.svg",
  },
  {
    name: "Appium",
    logo: "/appium.svg",
  },
  {
    name: "Apple",
    logo: "/apple-14.svg",
  },
  {
    name: "Firefox",
    logo: "/firefox-6.svg",
  },
  {
    name: "Google",
    logo: "/google-g-2015.svg",
  },
];

export default function Partners() {
  return (
    <section className=" mx-4 md:mx-12 lg:mx-32 xl:mx-64 max-w-7xl py-5">
      <div className="overflow-x-auto">
        <div className="flex flex-nowrap lg:justify-between gap-6 px-4">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="min-w-[10rem] p-4 flex items-center gap-3 justify-center hover:scale-105 transition"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="lg:w-10 h-16 w-8 object-contain filter "
              />
              <span className="lg:text-lg text-sm font-semibold text-white text-center">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
