/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import React, { useState, useRef } from "react";
// import {
//   Check,
//   Users,
//   Camera,
//   Video,
//   Star,
//   Zap,
//   Crown,
//   Sparkles,
//   ArrowRight,
//   Gift,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// interface PricingPlan {
//   id: string;
//   name: string;
//   guests: number;
//   price: number;
//   uploadsPerGuest: number;
//   popular?: boolean;
//   premium?: boolean;
//   features: string[];
//   color: string;
//   gradient: string;
//   icon: React.ReactNode;
// }

// const pricingPlans: PricingPlan[] = [
//   {
//     id: "free",
//     name: "Starter",
//     guests: 10,
//     price: 0,
//     uploadsPerGuest: 5,
//     features: [
//       "Up to 10 guests",
//       "5 uploads per guest",
//       "Basic photo sharing",
//       "Download all media",
//       "Event gallery",
//     ],
//     color: "text-green-400",
//     gradient: "from-green-500/20 to-emerald-500/20",
//     icon: <Gift className="w-6 h-6" />,
//   },
//   {
//     id: "basic",
//     name: "Basic",
//     guests: 100,
//     price: 7000,
//     uploadsPerGuest: 10,
//     popular: true,
//     features: [
//       "Up to 100 guests",
//       "10 uploads per guest",
//       "HD photo sharing",
//       "Video uploads",
//       "Event gallery",
//       "Basic analytics",
//     ],
//     color: "text-blue-400",
//     gradient: "from-blue-500/20 to-cyan-500/20",
//     icon: <Users className="w-6 h-6" />,
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     guests: 250,
//     price: 12000,
//     uploadsPerGuest: 15,
//     features: [
//       "Up to 250 guests",
//       "15 uploads per guest",
//       "HD photo & video sharing",
//       "Priority support",
//       "Advanced gallery",
//       "Detailed analytics",
//       "Custom branding",
//     ],
//     color: "text-purple-400",
//     gradient: "from-purple-500/20 to-pink-500/20",
//     icon: <Zap className="w-6 h-6" />,
//   },
//   {
//     id: "business",
//     name: "Business",
//     guests: 500,
//     price: 18000,
//     uploadsPerGuest: 20,
//     features: [
//       "Up to 500 guests",
//       "20 uploads per guest",
//       "Premium photo & video",
//       "24/7 priority support",
//       "Advanced features",
//       "Team collaboration",
//       "Custom branding",
//       "API access",
//     ],
//     color: "text-orange-400",
//     gradient: "from-orange-500/20 to-red-500/20",
//     icon: <Star className="w-6 h-6" />,
//   },
//   {
//     id: "enterprise-800",
//     name: "Enterprise",
//     guests: 800,
//     price: 23000,
//     uploadsPerGuest: 25,
//     premium: true,
//     features: [
//       "Up to 800 guests",
//       "25 uploads per guest",
//       "Enterprise features",
//       "Dedicated support",
//       "White-label solution",
//       "Advanced integrations",
//       "Custom development",
//       "SLA guarantee",
//     ],
//     color: "text-amber-400",
//     gradient: "from-amber-500/20 to-yellow-500/20",
//     icon: <Crown className="w-6 h-6" />,
//   },
//   {
//     id: "enterprise-1000",
//     name: "Enterprise Max",
//     guests: 1000,
//     price: 28000,
//     uploadsPerGuest: 25,
//     premium: true,
//     features: [
//       "Up to 1000 guests",
//       "25 uploads per guest",
//       "Maximum capacity",
//       "Dedicated support team",
//       "White-label solution",
//       "Priority processing",
//       "Custom integrations",
//       "Enterprise SLA",
//     ],
//     color: "text-pink-400",
//     gradient: "from-pink-500/20 to-rose-500/20",
//     icon: <Sparkles className="w-6 h-6" />,
//   },
// ];

// export default function Pricing() {
//   const [selectedPlan, setSelectedPlan] = useState<string>("basic");
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
//     "monthly"
//   );
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const formatPrice = (price: number) => {
//     if (price === 0) return "Free";
//     return `₦${price.toLocaleString()}`;
//   };

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: -336, // Width of card + gap (320 + 16)
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: 336, // Width of card + gap (320 + 16)
//         behavior: "smooth",
//       });
//     }
//   };

//   const handleSelectPlan = (planId: string) => {
//     setSelectedPlan(planId);
//     // Handle plan selection logic here
//     console.log("Selected plan:", planId);
//   };

//   return (
//     <div className="min-h-screen bg-primary py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-[28px] md:text-[40px] font-bold text-white mb-4">
//             Choose Your Event Plan
//           </h1>
//           <p className="text-sm sofia-sans tracking-wide text-gray-300 mb-8 max-w-3xl mx-auto">
//             Create unforgettable memories with your guests. From intimate
//             gatherings to large celebrations, we&apos;ve got the perfect plan
//             for your event.
//           </p>

//           {/* Billing toggle */}
//           <div className="inline-flex items-center bg-slate-800/50 border border-slate-600 rounded-full p-1">
//             <button
//               onClick={() => setBillingCycle("monthly")}
//               className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                 billingCycle === "monthly"
//                   ? "bg-white text-slate-900"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               Per Event
//             </button>
//             <button
//               onClick={() => setBillingCycle("yearly")}
//               className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                 billingCycle === "yearly"
//                   ? "bg-white text-slate-900"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               Annual Plans
//               <span className="ml-2 px-2 py-1 bg-[#FF851C]   text-white text-xs rounded-full">
//                 Save 20%
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="flex overflow-x-auto gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 scrollbar-hide px-4 md:px-0">
//           {pricingPlans.map((plan, index) => (
//             <div
//               key={plan.id}
//               className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 pt-14 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex-shrink-0 w-80 md:w-auto md:flex-shrink ${"border-slate-600 hover:border-slate-500"} ${
//                 selectedPlan === plan.id ? "ring-2 ring-white/20" : ""
//               }`}
//               style={{
//                 animationDelay: `${index * 100}ms`,
//                 minHeight: "600px",
//               }}
//             >
//               {/* Popular/Premium Badge */}
//               {(plan.popular || plan.premium || plan.price === 0) && (
//                 <div
//                   className={`absolute -top-1 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${
//                     plan.price === 0
//                       ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
//                       : plan.popular
//                       ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
//                       : "bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
//                   }`}
//                 >
//                   {plan.price === 0
//                     ? "Free Forever"
//                     : plan.popular
//                     ? "Most Popular"
//                     : "Premium"}
//                 </div>
//               )}

//               {/* Plan Header */}
//               <div className="text-center mb-6">
//                 <div
//                   className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center ${plan.color}`}
//                 >
//                   {plan.icon}
//                 </div>
//                 <h3 className="text-2xl font-bold text-white mb-2">
//                   {plan.name}
//                 </h3>
//                 <div className="mb-4">
//                   <span className="text-4xl font-bold text-white">
//                     {formatPrice(plan.price)}
//                   </span>
//                   {plan.price > 0 && (
//                     <span className="text-gray-400 ml-2">per event</span>
//                   )}
//                 </div>
//               </div>

//               {/* Key Stats */}
//               <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-700/30 rounded-xl">
//                 <div className="text-center">
//                   <div className="flex items-center justify-center space-x-1 mb-1">
//                     <Users className="w-4 h-4 text-blue-400" />
//                     <span className="text-2xl font-bold text-white">
//                       {plan.guests}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-400">Max Guests</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="flex items-center justify-center space-x-1 mb-1">
//                     <Camera className="w-4 h-4 text-purple-400" />
//                     <span className="text-2xl font-bold text-white">
//                       {plan.uploadsPerGuest}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-400">Uploads/Guest</p>
//                 </div>
//               </div>

//               {/* Features */}
//               <div className="space-y-3 mb-8">
//                 {plan.features.map((feature, idx) => (
//                   <div key={idx} className="flex items-center space-x-3">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.gradient}`}
//                     >
//                       <Check className={`w-3 h-3 ${plan.color}`} />
//                     </div>
//                     <span className="text-gray-300 text-sm">{feature}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* CTA Button */}
//               <button
//                 onClick={() => handleSelectPlan(plan.id)}
//                 className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
//                   plan.price === 0
//                     ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400"
//                     : plan.popular
//                     ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-400 hover:to-cyan-400"
//                     : plan.premium
//                     ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400"
//                     : "bg-white text-slate-900 hover:bg-gray-100"
//                 } ${selectedPlan === plan.id ? "ring-2 ring-white/50" : ""}`}
//               >
//                 <span>{plan.price === 0 ? "Start Free" : "Choose Plan"}</span>
//                 <ArrowRight className="w-4 h-4" />
//               </button>

//               {/* Total Capacity Indicator */}
//               <div className="mt-4 p-3 bg-slate-700/20 rounded-lg">
//                 <p className="text-xs text-gray-400 text-center">
//                   <strong className="text-white">
//                     {(plan.guests * plan.uploadsPerGuest).toLocaleString()}
//                   </strong>{" "}
//                   total uploads capacity
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Features Comparison */}
//         <div className="mt-16 text-center">
//           <h2 className="text-3xl font-bold text-white mb-4">
//             All plans include
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="flex flex-col items-center p-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
//                 <Camera className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-lg font-semibold text-white mb-2">
//                 HD Quality
//               </h3>
//               <p className="text-gray-400 text-sm">
//                 High-definition photo and video uploads with automatic
//                 compression
//               </p>
//             </div>

//             <div className="flex flex-col items-center p-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
//                 <Video className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-lg font-semibold text-white mb-2">
//                 Real-time Sync
//               </h3>
//               <p className="text-gray-400 text-sm">
//                 Instant photo and video sharing across all guest devices
//               </p>
//             </div>

//             <div className="flex flex-col items-center p-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
//                 <Star className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-lg font-semibold text-white mb-2">
//                 Easy Sharing
//               </h3>
//               <p className="text-gray-400 text-sm">
//                 Simple download and sharing options for all event memories
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* FAQ or Contact */}
//         <div className="mt-16 text-center">
//           <p className="text-gray-400 mb-4">
//             Need a custom plan for larger events?
//           </p>
//           <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
//             Contact our sales team →
//           </button>
//         </div>
//       </div>

//       {/* Browse by Topic Section */}
//       <div className="topics mt-20">
//         <div className="topics-container max-w-7xl mx-auto px-4">
//           <div className="margin-bottom-36px _36 mb-9">
//             <h2 className="blog-content-headline text-2xl font-bold text-white text-center mb-4">
//               Browse by Topic
//             </h2>
//           </div>

//           <div className="slide_contain">
//             <div className="slide_wrap w-dyn-list">
//               <div
//                 ref={scrollContainerRef}
//                 role="list"
//                 className="slide_list w-dyn-items flex justify-start items-stretch w-full overflow-x-auto gap-6 scrollbar-hide pb-4"
//               >
//                 {/* Event Types */}
//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=wedding"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/wedding-party.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       Wedding Events
//                     </h3>
//                   </a>
//                 </div>

//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=corporate"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/company-party.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       Corporate Events
//                     </h3>
//                   </a>
//                 </div>

//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=concert"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/concert1.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       Concerts & Shows
//                     </h3>
//                   </a>
//                 </div>

//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=sports"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/gym1.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       Sports Events
//                     </h3>
//                   </a>
//                 </div>

//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=conference"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/conference.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       Conferences
//                     </h3>
//                   </a>
//                 </div>

//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=club"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/club.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       Club Events
//                     </h3>
//                   </a>
//                 </div>

//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=church"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/church1.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       Church Events
//                     </h3>
//                   </a>
//                 </div>

//                 <div
//                   role="listitem"
//                   className="slide_item w-dyn-item flex-shrink-0"
//                 >
//                   <a
//                     href="/create-event?type=school"
//                     className="slide_card w-inline-block relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 hover:scale-105 transition-transform duration-300"
//                     style={{
//                       backgroundImage: "url('/school.jpg')",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="card_title text-white text-xl font-bold relative z-10">
//                       School Events
//                     </h3>
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation Arrows */}
//             <div className="slide_arrows flex justify-center items-center gap-4 mt-6">
//               <button
//                 onClick={scrollLeft}
//                 className="slide_arrow is--left w-inline-block bg-slate-800/50 hover:bg-slate-700/50 p-3 rounded-full transition-all duration-300 group"
//               >
//                 <ChevronLeft className="w-6 h-6 text-white group-hover:text-yellow-400" />
//               </button>
//               <button
//                 onClick={scrollRight}
//                 className="slide_arrow is--right w-inline-block bg-slate-800/50 hover:bg-slate-700/50 p-3 rounded-full transition-all duration-300 group"
//               >
//                 <ChevronRight className="w-6 h-6 text-white group-hover:text-yellow-400" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  Users,
  Camera,
  Video,
  Star,
  Zap,
  Crown,
  Sparkles,
  Gift,
  ChevronLeft,
  ChevronRight,
  Upload,
  Shield,
  Download,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

interface PricingPlan {
  id: string;
  name: string;
  guests: number;
  price: number;
  uploadsPerGuest: number;
  popular?: boolean;
  premium?: boolean;
  features: string[];
  icon: React.ReactNode;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Starter",
    guests: 10,
    price: 0,
    uploadsPerGuest: 5,
    features: [
      "Up to 10 guests",
      "5 uploads per guest",
      "Basic photo sharing",
      "Download all media",
      "Event gallery",
    ],
    icon: <Gift className="w-6 h-6" />,
  },
  {
    id: "basic",
    name: "Basic",
    guests: 100,
    price: 7000,
    uploadsPerGuest: 10,
    popular: true,
    features: [
      "Up to 100 guests",
      "10 uploads per guest",
      "HD photo sharing",
      "Video uploads",
      "Event gallery",
      "Basic analytics",
    ],
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: "pro",
    name: "Pro",
    guests: 250,
    price: 12000,
    uploadsPerGuest: 15,
    features: [
      "Up to 250 guests",
      "15 uploads per guest",
      "HD photo & video sharing",
      "Priority support",
      "Advanced gallery",
      "Detailed analytics",
      "Custom branding",
    ],
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: "business",
    name: "Business",
    guests: 500,
    price: 18000,
    uploadsPerGuest: 20,
    features: [
      "Up to 500 guests",
      "20 uploads per guest",
      "Premium photo & video",
      "24/7 priority support",
      "Advanced features",
      "Team collaboration",
      "Custom branding",
      "API access",
    ],
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: "enterprise-800",
    name: "Enterprise",
    guests: 800,
    price: 23000,
    uploadsPerGuest: 25,
    premium: true,
    features: [
      "Up to 800 guests",
      "25 uploads per guest",
      "Enterprise features",
      "Dedicated support",
      "White-label solution",
      "Advanced integrations",
      "Custom development",
      "SLA guarantee",
    ],
    icon: <Crown className="w-6 h-6" />,
  },
  {
    id: "enterprise-1000",
    name: "Enterprise Max",
    guests: 1000,
    price: 28000,
    uploadsPerGuest: 25,
    premium: true,
    features: [
      "Up to 1000 guests",
      "25 uploads per guest",
      "Maximum capacity",
      "Dedicated support team",
      "White-label solution",
      "Priority processing",
      "Custom integrations",
      "Enterprise SLA",
    ],
    icon: <Sparkles className="w-6 h-6" />,
  },
];

const eventTypes = [
  { name: "Wedding Events", image: "/wedding-party.jpg", type: "wedding" },
  { name: "Corporate Events", image: "/company-party.jpg", type: "corporate" },
  { name: "Concerts & Shows", image: "/concert1.jpg", type: "concert" },
  { name: "Sports Events", image: "/gym1.jpg", type: "sports" },
  { name: "Conferences", image: "/conference.jpg", type: "conference" },
  { name: "Club Events", image: "/club.jpg", type: "club" },
  { name: "Church Events", image: "/church1.jpg", type: "church" },
  { name: "School Events", image: "/school.jpg", type: "school" },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const featuresRef = useRef(null);
  const topicsRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const isTopicsInView = useInView(topicsRef, { once: true, margin: "-100px" });

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `₦${price.toLocaleString()}`;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -336,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 336,
        behavior: "smooth",
      });
    }
  };

  const getBadgeColor = (plan: PricingPlan) => {
    if (plan.price === 0) return "from-[#FF851C] to-amber-500";
    if (plan.popular) return "from-[#270D01] to-[#FF851C]";
    if (plan.premium) return "from-amber-600 to-amber-400";
    return "from-[#FF851C] to-amber-500";
  };

  const getCardGlow = (plan: PricingPlan) => {
    if (plan.price === 0) return "from-[#FF851C]/10 to-amber-500/10";
    if (plan.popular) return "from-[#270D01]/20 to-[#FF851C]/20";
    if (plan.premium) return "from-amber-600/20 to-amber-400/20";
    return "from-[#FF851C]/10 to-amber-500/10";
  };

  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-[28px] md:text-[40px] font-bold text-white mb-4"
            initial={{ scale: 0.9 }}
            animate={isHeaderInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-[#FF851C] to-amber-400 bg-clip-text text-transparent">
              Choose Your
            </span>{" "}
            Event Plan
          </motion.h1>

          <motion.p
            className="text-sm sofia-sans tracking-wide text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Create unforgettable memories with your guests. From intimate
            gatherings to large celebrations, explore the perfect plan features
            for your event.
          </motion.p>

          {/* Modern Billing Toggle */}
          <motion.div
            className="inline-flex items-center bg-black/30 backdrop-blur-sm border border-gray-600/30 rounded-full p-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isHeaderInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#FF851C] to-amber-500 text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Per Event
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#FF851C] to-amber-500 text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Annual Plans
              <span className="px-2 py-1 bg-gradient-to-r from-[#270D01] to-[#FF851C] text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Animated Pricing Cards */}
        <motion.div
          ref={cardsRef}
          className="flex overflow-x-auto gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 scrollbar-hide px-4 md:px-0"
          initial={{ y: 100, opacity: 0 }}
          animate={isCardsInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="relative bg-black/20 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-6 pt-14 
                         transition-all duration-300 hover:scale-105 hover:shadow-2xl flex-shrink-0 w-80 md:w-auto 
                         md:flex-shrink group cursor-pointer"
              style={{ minHeight: "600px" }}
              initial={{ y: 50, opacity: 0 }}
              animate={isCardsInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular/Premium Badge */}
              {(plan.popular || plan.premium || plan.price === 0) && (
                <motion.div
                  className={`absolute -top-1 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium 
                             bg-gradient-to-r ${getBadgeColor(plan)} ${
                    plan.premium || plan.popular ? "text-black" : "text-white"
                  }`}
                  initial={{ scale: 0 }}
                  animate={isCardsInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  {plan.price === 0
                    ? "Free Forever"
                    : plan.popular
                    ? "Most Popular"
                    : "Premium"}
                </motion.div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${getCardGlow(
                    plan
                  )} rounded-2xl 
                             flex items-center justify-center text-[#FF851C] border border-[#FF851C]/20`}
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {plan.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-[#FF851C] to-amber-400 bg-clip-text text-transparent">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 ml-2">per event</span>
                  )}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/20 rounded-xl border border-[#FF851C]/10">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="w-4 h-4 text-[#FF851C]" />
                    <span className="text-2xl font-bold text-white">
                      {plan.guests}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Max Guests</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="text-2xl font-bold text-white">
                      {plan.uploadsPerGuest}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Uploads/Guest</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center space-x-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={isCardsInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF851C] to-amber-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Total Capacity Indicator */}
              <div className="mt-auto p-3 bg-gradient-to-r from-[#270D01]/20 to-[#FF851C]/10 rounded-lg border border-[#FF851C]/20">
                <p className="text-xs text-gray-400 text-center">
                  <strong className="text-[#FF851C]">
                    {(plan.guests * plan.uploadsPerGuest).toLocaleString()}
                  </strong>{" "}
                  total uploads capacity
                </p>
              </div>

              {/* Hover Glow Effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${getCardGlow(
                  plan
                )} rounded-2xl -z-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === plan.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Features Comparison */}
        <motion.div
          ref={featuresRef}
          className="mt-16 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#FF851C] to-amber-400 bg-clip-text text-transparent">
              All plans
            </span>{" "}
            <span className="text-white">include</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Camera className="w-6 h-6 text-black" />,
                title: "HD Quality",
                description:
                  "High-definition photo and video uploads with automatic compression",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <Shield className="w-6 h-6 text-black" />,
                title: "Real-time Sync",
                description:
                  "Instant photo and video sharing across all guest devices",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <Download className="w-6 h-6 text-black" />,
                title: "Easy Sharing",
                description:
                  "Simple download and sharing options for all event memories",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 group"
                initial={{ y: 30, opacity: 0 }}
                animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 
                             group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={isFeaturesInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-400 mb-4">
            Need a custom plan for larger events?
          </p>
          <motion.button
            className="bg-gradient-to-r from-[#FF851C] to-amber-400 bg-clip-text text-transparent font-semibold 
                       hover:from-amber-400 hover:to-[#FF851C] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Contact our sales team →
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Browse by Topic Section */}
      <motion.div
        ref={topicsRef}
        className="topics mt-20"
        initial={{ y: 50, opacity: 0 }}
        animate={isTopicsInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="topics-container max-w-7xl mx-auto px-4">
          <div className="margin-bottom-36px _36 mb-9">
            <h2 className="text-2xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-[#FF851C] to-amber-400 bg-clip-text text-transparent">
                Browse by
              </span>{" "}
              <span className="text-white">Topic</span>
            </h2>
          </div>

          <div className="slide_contain">
            <div className="slide_wrap">
              <div
                ref={scrollContainerRef}
                className="flex justify-start items-stretch w-full overflow-x-auto gap-6 scrollbar-hide pb-4"
              >
                {eventTypes.map((event, index) => (
                  <motion.div
                    key={event.type}
                    className="flex-shrink-0"
                    initial={{ x: 100, opacity: 0 }}
                    animate={isTopicsInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <motion.a
                      href={`/create-event?type=${event.type}`}
                      className="relative w-80 h-48 rounded-2xl overflow-hidden bg-cover bg-center flex items-end p-6 
                                 hover:scale-105 transition-all duration-300 group cursor-pointer block"
                      style={{ backgroundImage: `url('${event.image}')` }}
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                                      group-hover:from-[#270D01]/60 transition-all duration-300"
                      ></div>
                      <h3
                        className="text-white text-xl font-bold relative z-10 group-hover:text-[#FF851C] 
                                     transition-colors duration-300"
                      >
                        {event.name}
                      </h3>

                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#FF851C]/10 to-amber-500/10 rounded-2xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Navigation Arrows */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <motion.button
                onClick={scrollLeft}
                className="bg-black/30 backdrop-blur-sm hover:bg-gradient-to-r hover:from-[#270D01] hover:to-[#FF851C] 
                           p-3 rounded-full transition-all duration-300 group border border-[#FF851C]/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:text-black transition-colors duration-300" />
              </motion.button>
              <motion.button
                onClick={scrollRight}
                className="bg-black/30 backdrop-blur-sm hover:bg-gradient-to-r hover:from-[#270D01] hover:to-[#FF851C] 
                           p-3 rounded-full transition-all duration-300 group border border-[#FF851C]/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:text-black transition-colors duration-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
