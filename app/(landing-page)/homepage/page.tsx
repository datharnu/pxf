import React from "react";
import Heropage from "./components/Heropage";

import Features from "./components/Features";
import FAQ from "./components/Faq";
import FAQMOBILE from "./components/FaqMobile";

export default function HomePage() {
  return (
    <div className="">
      <Heropage />
      <hr className=" border-gray-300  " />
      <Features />
      <FAQMOBILE />
      <FAQ />
    </div>
  );
}
