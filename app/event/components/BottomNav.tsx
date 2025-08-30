// components/BottomNav.tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const filterOptions = [
    { value: "all", label: "All", photos: "9 photos" },
    { value: "anu", label: "Anu's PXF", photos: "2 photos" },
    { value: "emmanuel", label: "Emmanuel's PXF", photos: "5 photos" },
    { value: "odunayo", label: "Odunayo's PXF", photos: "2 photos" },
  ];

  const handleFilterSelect = (filterValue: string) => {
    onTabChange(filterValue);
    setShowFilterDrawer(false);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700">
        <div className="flex justify-around items-center py-3">
          <button
            className={`flex flex-col items-center px-4 py-2 ${
              activeTab === "all" ? "text-white" : "text-[#aaaaaa]"
            }`}
            onClick={() => onTabChange("all")}
          >
            <span className="text-sm font-medium">All</span>
            {activeTab === "all" && (
              <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
            )}
          </button>

          <button
            className={`flex flex-col items-center px-4 py-2 ${
              activeTab === "my" ? "text-white" : "text-[#aaaaaa]"
            }`}
            onClick={() => onTabChange("my")}
          >
            <span className="text-sm font-medium">My PXF</span>
            {activeTab === "my" && (
              <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
            )}
          </button>

          <button
            className={`flex flex-col items-center px-4 py-2 ${
              activeTab === "choose" ? "text-white" : "text-[#aaaaaa]"
            }`}
            onClick={() => setShowFilterDrawer(true)}
          >
            <span className="text-sm font-medium">Choose a PXF</span>
            {activeTab === "choose" && (
              <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
            )}
          </button>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilterDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/60"
          onClick={() => setShowFilterDrawer(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Filter By</h3>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="space-y-3">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left py-3 px-4 rounded-lg ${
                    activeTab === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                  }`}
                  onClick={() => handleFilterSelect(option.value)}
                >
                  {option.label}
                  <p>{option.photos}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
