"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { navLinks } from "@/app/utils/Navlinks";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Set visible after component mounts to trigger animation
    setIsVisible(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="shadow-sm">
      <motion.div
        initial={{ height: 0, opacity: 0, y: -20 }}
        animate={{
          height: isVisible ? "auto" : 0,
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -20,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="shadow-sm overflow-hidden"
      >
        <div className="bg-white rounded-xl py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-20">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">PXF</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-6">
                {navLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-gray-700 text-sm highway-ghotic tracking-widest hover:text-blue-600 uppercase font-semibold  transition duration-200"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Authentication Buttons - Hidden on Mobile */}
          <div className="hidden lg:flex items-center highway-ghotic gap-2">
            <Link href="/sign-in">
              <Button className="h-8 font-bold text-sm">LOG IN</Button>
            </Link>
            <Link href="/create-account">
              <Button className="h-8 font-bold text-sm bg-gray-200 text-primary">
                SIGN UP
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white px-6 pb-4 mt-5  rounded-bl-xl rounded-tr-xl"
          >
            <ul className="space-y-4 pt-2">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-gray-700 text-sm hover:text-blue-600 uppercase font-semibold transition duration-200 block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              <li className="pt-4 flex flex-col gap-3">
                <Link href="/sign-in" className="w-full">
                  <Button className="h-8 font-bold text-sm w-full">
                    LOG IN
                  </Button>
                </Link>
                <Link href="/create-account" className="w-full">
                  <Button className="h-8 font-bold text-sm bg-gray-200 text-primary w-full">
                    SIGN UP
                  </Button>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
