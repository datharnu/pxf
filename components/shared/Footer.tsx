"use client";
import React from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  Shield,
  Star,
  Users,
} from "lucide-react";

export default function ModernFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                PXF Events
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Create unforgettable memories with seamless photo and video
              sharing for your special events.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { icon: <Twitter className="w-4 h-4" />, href: "#" },
                { icon: <Facebook className="w-4 h-4" />, href: "#" },
                { icon: <Instagram className="w-4 h-4" />, href: "#" },
                { icon: <Linkedin className="w-4 h-4" />, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-8 h-8 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <span className="text-gray-400 hover:text-white transition-colors">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {[
                "About Us",
                "Pricing",
                "Blog",
                "Careers",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <a
                  href="mailto:hello@PXF.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  hello@PXF.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <a
                  href="tel:+2348123456789"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  +234 812 345 6789
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-gray-300 text-sm">Lagos, Nigeria</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-black rounded-lg font-medium hover:from-amber-500 hover:to-orange-500 transition-all duration-200 text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs">
            <div className="flex items-center space-x-1 text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span>10,000+ Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0 text-sm text-gray-400">
            <span>© {currentYear} B-10 Technology. All rights reserved.</span>
            <span>Made with ❤️ in Nigeria</span>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group z-50"
        aria-label="Back to top"
      >
        <ArrowRight className="w-4 h-4 transform -rotate-90 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
}
