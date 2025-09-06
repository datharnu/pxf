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
} from "lucide-react";

interface PhotobookComingSoonProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotobookComingSoon({
  isOpen,
  onClose,
}: PhotobookComingSoonProps) {
  const [isVisible, setIsVisible] = useState(false);
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
        className={`relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl transform transition-all duration-500 ${
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
        <div className="text-center">
          {/* Animated icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-3 h-3 text-yellow-900" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Photobook
          </h2>
          <p className="text-white/60 text-sm mb-6">Premium Feature</p>

          {/* Coming soon message */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                Coming Soon
              </span>
            </div>

            <p className="text-white/80 text-lg font-medium mb-2">
              We&apos;re crafting something magical ✨
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Turn your precious memories into beautiful, personalized
              photobooks. Professional layouts, premium materials, and seamless
              creation experience.
            </p>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                <Camera className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white/80 text-xs font-medium">Auto Layout</p>
              <p className="text-white/50 text-xs">Smart organization</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-2">
                <Star className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-white/80 text-xs font-medium">HD Quality</p>
              <p className="text-white/50 text-xs">Premium prints</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25">
              <Bell className="w-4 h-4" />
              <span>Notify Me When Ready</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-white/10 text-white/80 font-medium py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/10"
            >
              Got it, thanks!
            </button>
          </div>

          {/* Footer message */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-2 text-white/50 text-xs">
              <Heart className="w-3 h-3 text-red-400" />
              <span>Crafted with love by our team</span>
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
