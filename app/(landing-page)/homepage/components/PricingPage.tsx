"use client";
import React, { useState } from "react";
import {
  Check,
  Users,
  Camera,
  Video,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Gift,
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  guests: number;
  price: number;
  uploadsPerGuest: number;
  popular?: boolean;
  premium?: boolean;
  features: string[];
  color: string;
  gradient: string;
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
    color: "text-green-400",
    gradient: "from-green-500/20 to-emerald-500/20",
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
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/20",
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
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-pink-500/20",
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
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-red-500/20",
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
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-yellow-500/20",
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
    color: "text-pink-400",
    gradient: "from-pink-500/20 to-rose-500/20",
    icon: <Sparkles className="w-6 h-6" />,
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string>("basic");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `₦${price.toLocaleString()}`;
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Handle plan selection logic here
    console.log("Selected plan:", planId);
  };

  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Event Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create unforgettable memories with your guests. From intimate
            gatherings to large celebrations, we&apos;ve got the perfect plan
            for your event.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-slate-800/50 border border-slate-600 rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Per Event
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === "yearly"
                  ? "bg-white text-slate-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Annual Plans
              <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? "border-blue-500 shadow-lg shadow-blue-500/25"
                  : plan.premium
                  ? "border-amber-500 shadow-lg shadow-amber-500/25"
                  : plan.price === 0
                  ? "border-green-500 shadow-lg shadow-green-500/25"
                  : "border-slate-600 hover:border-slate-500"
              } ${selectedPlan === plan.id ? "ring-2 ring-white/20" : ""}`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Popular/Premium Badge */}
              {(plan.popular || plan.premium || plan.price === 0) && (
                <div
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${
                    plan.price === 0
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                  }`}
                >
                  {plan.price === 0
                    ? "Free Forever"
                    : plan.popular
                    ? "Most Popular"
                    : "Premium"}
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center ${plan.color}`}
                >
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 ml-2">per event</span>
                  )}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-700/30 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-2xl font-bold text-white">
                      {plan.guests}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Max Guests</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Camera className="w-4 h-4 text-purple-400" />
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
                  <div key={idx} className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.gradient}`}
                    >
                      <Check className={`w-3 h-3 ${plan.color}`} />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  plan.price === 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400"
                    : plan.popular
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-400 hover:to-cyan-400"
                    : plan.premium
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400"
                    : "bg-white text-slate-900 hover:bg-gray-100"
                } ${selectedPlan === plan.id ? "ring-2 ring-white/50" : ""}`}
              >
                <span>{plan.price === 0 ? "Start Free" : "Choose Plan"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Total Capacity Indicator */}
              <div className="mt-4 p-3 bg-slate-700/20 rounded-lg">
                <p className="text-xs text-gray-400 text-center">
                  <strong className="text-white">
                    {(plan.guests * plan.uploadsPerGuest).toLocaleString()}
                  </strong>{" "}
                  total uploads capacity
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            All plans include
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                HD Quality
              </h3>
              <p className="text-gray-400 text-sm">
                High-definition photo and video uploads with automatic
                compression
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Real-time Sync
              </h3>
              <p className="text-gray-400 text-sm">
                Instant photo and video sharing across all guest devices
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Easy Sharing
              </h3>
              <p className="text-gray-400 text-sm">
                Simple download and sharing options for all event memories
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Contact */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Need a custom plan for larger events?
          </p>
          <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Contact our sales team →
          </button>
        </div>
      </div>
    </div>
  );
}
