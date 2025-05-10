import React from "react";
import Heropage from "./components/Heropage";

import Features from "./components/Features";

export default function HomePage() {
  return (
    <div className="">
      <Heropage />
      <hr className=" border-gray-300  " />
      <Features />
    </div>
  );
}
