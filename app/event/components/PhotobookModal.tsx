/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  Sparkles,
  Calendar,
  Bell,
  Star,
  Heart,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Palette,
  Layout,
  Check,
} from "lucide-react";
import Image from "next/image";

interface PhotobookComingSoonProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample photos for the photobook preview
const samplePhotos = [
  "/pic1.jpg",
  "/pic2.jpg",
  "/pic3.jpg",
  "/pic4.jpg",
  "/pic5.jpg",
  "/pic6.jpg",
  "/pic7.jpg",
  "/pic8.jpg",
];

// Photobook layout templates
const layoutTemplates = [
  {
    id: "classic",
    name: "Classic",
    icon: <Layout className="w-4 h-4" />,
    description: "Traditional photo album layout",
  },
  {
    id: "modern",
    name: "Modern",
    icon: <Palette className="w-4 h-4" />,
    description: "Contemporary design with artistic flair",
  },
  {
    id: "minimal",
    name: "Minimal",
    icon: <Camera className="w-4 h-4" />,
    description: "Clean and simple presentation",
  },
];

export default function PhotobookComingSoon({
  isOpen,
  onClose,
}: PhotobookComingSoonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState("modern");
  const [particlePositions, setParticlePositions] = useState<
    Array<{ x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Generate random particle positions
      const particles = Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticlePositions(particles);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % 3);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + 3) % 3);
  };

  const renderPhotobookPage = (pageIndex: number) => {
    switch (pageIndex) {
      case 0:
        return (
          <div className="bg-white rounded-lg shadow-lg p-4 h-full">
            <div className="grid grid-cols-2 gap-2 h-full">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={samplePhotos[0]}
                  alt="Event photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={samplePhotos[1]}
                  alt="Event photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg col-span-2 h-20">
                <Image
                  src={samplePhotos[2]}
                  alt="Event photo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-lg p-4 h-full">
            <div className="flex flex-col gap-2 h-full">
              <div className="relative overflow-hidden rounded-lg h-24">
                <Image
                  src={samplePhotos[3]}
                  alt="Event photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={samplePhotos[4]}
                    alt="Event photo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={samplePhotos[5]}
                    alt="Event photo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white rounded-lg shadow-lg p-4 h-full">
            <div className="h-full flex flex-col gap-2">
              <div className="relative overflow-hidden rounded-lg flex-1">
                <Image
                  src={samplePhotos[6]}
                  alt="Event photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative overflow-hidden rounded-lg w-1/2 h-16">
                  <Image
                    src={samplePhotos[7]}
                    alt="Event photo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg w-1/2 h-16">
                  <Image
                    src={samplePhotos[0]}
                    alt="Event photo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/80 backdrop-blur-sm" : "bg-black/0"
      }`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particlePositions.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main modal */}
      <div
        className={`relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl p-6 max-w-4xl w-full mx-4 border border-white/10 shadow-2xl transform transition-all duration-500 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-8"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Photobook Preview */}
          <div className="lg:w-1/2">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Photobook Preview
              </h2>
              <p className="text-white/60 text-sm">
                See how your memories will look
              </p>
            </div>

            {/* Photobook Preview */}
            <div className="bg-slate-800/50 rounded-2xl p-4 mb-4">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-2 shadow-inner">
                <div className="h-64 rounded-lg overflow-hidden">
                  {renderPhotobookPage(currentPage)}
                </div>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={prevPage}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Previous</span>
                </button>

                <div className="flex space-x-2">
                  {[0, 1, 2].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentPage === page ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <span className="text-sm">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Options and Info */}
          <div className="lg:w-1/2">
            {/* Layout Templates */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">
                Choose Your Style
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {layoutTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedLayout(template.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedLayout === template.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-400">{template.icon}</div>
                      <div className="text-left">
                        <p className="text-white font-medium text-sm">
                          {template.name}
                        </p>
                        <p className="text-white/60 text-xs">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">
                What&apos;s Included
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-sm">High-quality photo printing</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-sm">Professional layouts</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="text-sm">Premium paper & binding</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-sm">Custom cover design</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25">
                <Download className="w-4 h-4" />
                <span>Create Photobook</span>
              </button>

              <button className="w-full bg-white/10 text-white/80 font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/10 flex items-center justify-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share Preview</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full text-white/60 font-medium py-2 px-6 rounded-xl hover:text-white/80 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}

// Demo component to show usage
export function PhotobookDemo() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-8">
          Click the button to see the Photobook Coming Soon modal
        </h1>

        <button
          onClick={() => setShowComingSoon(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200 flex items-center space-x-2 mx-auto"
        >
          <BookOpen className="w-5 h-5" />
          <span>Open Photobook</span>
        </button>
      </div>

      <PhotobookComingSoon
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
}

export { PhotobookComingSoon };
