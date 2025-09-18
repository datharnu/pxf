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
      "Guests can access PXF directly through a link or QR code in their browser. There’s no need to download or install anything they simply click, join, and start uploading or viewing photos instantly.",
    icon: "/pov1.svg",
  },
  {
    question: "Does PXF work without internet?",
    answer:
      "PXF requires the internet (either WiFi or cellular data) to both access the experience and send in photos . For the vast majority of locations, this isn't an issue, but if you are using PXF in an area that has spotty internet, we recommend testing it out at the venue beforehand.",
    icon: "/pov2.svg",
  },
  {
    question: "How much does PXF cost?",
    answer:
      "It's free for events with up to 10 participants. For larger events, we offer affordable premium plans with additional features. Check our pricing page for detailed information on all available plans.",
    icon: "/pov3.svg",
  },
  {
    question: "How do I get a QR code?",
    answer:
      "Once you create an event on our website, a unique QR code and link are automatically generated for you. You can easily download the QR code and share it with your guests, so they can join and upload their photos instantly.",
    icon: "/pov4.svg",
  },
  {
    question: "Can i review photos ? ",
    answer:
      "Not yet but a feature that is coming soon. We are working on a feature that will allow event hosts to review and approve photos before they are shared with guests. This will give you more control over the content shared at your event.",
    icon: "/pov5.svg",
  },
  {
    question: "Additional Questions?",
    answer:
      "Feel free to contact our support team via the app or email us at support@memoriaapp.com. We typically respond within 24 hours and are happy to help with any questions or concerns you might have.",
    icon: "/pov6.svg",
  },
];

// Individual FAQ item component with fixed height and content overflow
const SingleFAQItem = ({ item }: { item: FAQItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-3 h-auto">
      <div
        className={`rounded-md border bg-[#FCFCFE1A] ${
          isOpen
            ? "border-gray-600 shadow-lg"
            : "border-gray-600 hover:bg-gray-800"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between p-4 text-left focus:outline-none"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 font-semibold text-base text-gray-200">
            <img src={item.icon} alt="" className="w-5 h-5" />
            <span>{item.question}</span>
          </div>
          <span className="text-xl">{isOpen ? "–" : "+"}</span>
        </button>

        {/* Content area - only rendered when open */}
        {isOpen && (
          <div className="px-4 pb-4 text-sm text-gray-300 font-semibold">
            {item.answer}
          </div>
        )}
      </div>
    </div>
  );
};

// Main FAQ component with explicit item width control
const FAQMOBILE = () => {
  return (
    <div className="lg:hidden bg-primary py-10  ">
      <h1 className="text-2xl font-bold text-gray-200 mb-4 text-center">
        FAQs
      </h1>
      <div className="mx-4 md:mx-8 lg:mx-32 max-w-[90rem] ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqItems.map((item, index) => (
            <div key={index} className="flex flex-col w-full h-full">
              <SingleFAQItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQMOBILE;
