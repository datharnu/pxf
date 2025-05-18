"use client";
import React from "react";
const FormImages = () => {
  return (
    <div className="relative h-72 w-80 my-8">
      <div className="absolute left-0 transform -rotate-3 shadow-lg rounded-xl overflow-hidden w-36 z-10">
        <img
          src="/conference.jpg"
          alt="Snow scene"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute left-20 shadow-lg rounded-xl overflow-hidden w-36 z-30">
        <img
          src="/pic4.jpg"
          alt="Party scene"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute right-0 transform rotate-3 shadow-lg rounded-xl overflow-hidden w-36 z-20">
        <img
          src="/pic2.jpg"
          alt="Concert scene"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default FormImages;
