"use client";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
  icon: string;
};

const faqItems: FAQItem[] = [
  {
    question: "How is it possible guests don't have to download the app?",
    answer:
      "PXF uses a technology called App Clips on iOS and Instant Apps on Android. App Clips and Instant Apps let others join your POV camera directly from a link or QR Code, without having to download an app from the App Store.",
    icon: "/pov1.svg",
  },
  {
    question: "Does POV work without internet?",
    answer:
      "POV requires the internet (either WiFi or cellular data) to both access the experience and send in photos . For the vast majority of locations, this isn't an issue, but if you are using POV in an area that has spotty internet, we recommend testing it out at the venue beforehand.",
    icon: "/pov2.svg",
  },
  {
    question: "How much does POV cost?",
    answer:
      "It's free for events with up to 10 participants. For larger events, we offer affordable premium plans with additional features. Check our pricing page for detailed information on all available plans.",
    icon: "/pov3.svg",
  },
  {
    question: "How do I get a QR code?",
    answer:
      "You can generate QR codes directly inside the app from your event dashboard. Simply create your event, navigate to sharing options, and select 'Generate QR Code'. You can then download and share it with your guests.",
    icon: "/pov4.svg",
  },
  {
    question: "Can i review photos before the gallery goes live?",
    answer:
      "Yes, you can review photos before the gallery goes live. You can do this by navigating to your event dashboard and selecting 'Review Photos'.",
    icon: "/pov5.svg",
  },
  {
    question: "Additional Questions?",
    answer:
      "Feel free to contact our support team via the app or email us at support@povapp.com. We typically respond within 24 hours and are happy to help with any questions or concerns you might have.",
    icon: "/pov6.svg",
  },
];

// Individual FAQ item with animated dropdown
const SingleFAQItem = ({ item }: { item: FAQItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full hidden lg:block">
      <div
        className={`rounded-md border bg-[#FCFCFE1A] transition-all duration-300 ${
          isOpen ? "border-gray-600 shadow-lg z-20" : "border-gray-600 "
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between p-8 text-left focus:outline-none"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 font-semibold text-base text-gray-200">
            <img src={item.icon} alt="" className="w-5 lg:w-8 lg:h-8 h-5" />
            <span>{item.question}</span>
          </div>
          <span
            className={`text-xl transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-90"
            }`}
          >
            {isOpen ? "–" : "+"}
          </span>
        </button>

        {/* Animated dropdown using CSS transitions */}
        <div
          className={`absolute  left-0 font-semibold  right-0 bg-[#FCFCFE1A]  border-gray-700 p-8 tracking-wider text-[15px]  pt-1 pb-4  text-gray-300 z-20 shadow-lg rounded-b-md transition-all duration-300 origin-top ${
            isOpen
              ? "opacity-100 scale-y-100 translate-y-0  "
              : "opacity-0 scale-y-0 -translate-y-2  pointer-events-none"
          }`}
        >
          {item.answer}
        </div>
      </div>
    </div>
  );
};

// Main FAQ component
const FAQ = () => {
  return (
    <div className="bg-primary flex justify-center pb-20">
      <div className="mx-4 md:mx-8 lg:mx-32 max-w-[90rem] ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {faqItems.map((item, index) => (
            <div key={index} className="w-full h-full ">
              <SingleFAQItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
