// "use client";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { navLinks } from "@/app/utils/Navlinks";
// import { Button } from "../ui/button";
// import { Menu, X, ChevronRight } from "lucide-react";
// import { useIsUserLoggedInStore } from "@/store/userStore";
// import ProfileAvatar from "./AvatarImage";

// export default function Navbar() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { isUserLoggedIn } = useIsUserLoggedInStore();

//   useEffect(() => {
//     // Set visible after component mounts to trigger animation
//     setIsVisible(true);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleSignOut = () => {
//     // Clear the authentication cookie
//     clearCookie("token");
//     clearCookie("refresh_token");
//     // Clear all items in localStorage
//     localStorage.clear();
//     // Redirect to the sign-in page or home page
//     window.location.href = "/sign-in";
//   };

//   const clearCookie = (name: string) => {
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
//   };

//   return (
//     <div className="shadow-sm">
//       <motion.div
//         initial={{ height: 0, opacity: 0, y: -20 }}
//         animate={{
//           height: isVisible ? "auto" : 0,
//           opacity: isVisible ? 1 : 0,
//           y: isVisible ? 0 : -20,
//         }}
//         transition={{
//           duration: 0.5,
//           ease: "easeOut",
//         }}
//         className="shadow-sm overflow-hidden"
//       >
//         <div className="bg-white rounded-xl py-3 px-6 flex items-center justify-between">
//           <div className="flex items-center gap-20">
//             <div className="flex items-center">
//               <Link href={"/"} className="text-xl font-bold">
//                 PXF
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden lg:block">
//               <ul className="flex space-x-6">
//                 {navLinks.map((link) => (
//                   <li key={link.title}>
//                     <Link
//                       href={link.href}
//                       className="text-gray-700 text-sm highway-ghotic tracking-widest hover:text-blue-600 uppercase font-semibold transition duration-200"
//                     >
//                       {link.title}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           </div>

//           {/* Authentication Buttons - Hidden on Mobile */}
//           {!isUserLoggedIn && (
//             <div className="hidden lg:flex items-center highway-ghotic gap-2">
//               <Link href="/sign-in">
//                 <Button className="h-8 font-bold text-sm">LOG IN</Button>
//               </Link>
//               <Link href="/create-account">
//                 <Button className="h-8 font-bold text-sm bg-gray-200 text-primary">
//                   SIGN UP
//                 </Button>
//               </Link>
//             </div>
//           )}
//           {isUserLoggedIn && (
//             <div className="hidden lg:flex items-center">
//               <div>
//                 <ProfileAvatar />
//               </div>
//               <Link href="#" className="w-full">
//                 <div
//                   onClick={handleSignOut}
//                   className="flex items-center justify-between text-gray-300 hover:text-white px-3 py-4 text-sm font-medium transition-all duration-200  border-gray-800"
//                 >
//                   <Button className="h-8 font-bold text-sm bg-gray-200 text-primary hover:text-white">
//                     SIGN OUT
//                   </Button>

//                   <ChevronRight
//                     size={16}
//                     className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
//                   />
//                 </div>
//               </Link>
//             </div>
//           )}

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200"
//             onClick={toggleMenu}
//             aria-label="Toggle menu"
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <motion.div
//             initial={{ x: "-100%", opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: "-100%", opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="lg:hidden fixed inset-0 bg-primary z-50 overflow-y-auto"
//           >
//             {/* Menu Header */}
//             <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-800">
//               <Link
//                 href={"/"}
//                 className="text-white font-bold text-xl tracking-wider"
//               >
//                 PXF
//               </Link>
//               <button
//                 onClick={toggleMenu}
//                 className="text-gray-400 hover:text-white transition-colors duration-200"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Menu Content */}
//             <div className="px-4 py-4">
//               <div className="space-y-6 pt-4">
//                 {/* Main Navigation */}

//                 <div>
//                   {navLinks.map((link) => (
//                     <div key={link.title}>
//                       <Link
//                         href={link.href}
//                         className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800 last:border-b-0"
//                         onClick={() => setIsMenuOpen(false)}
//                       >
//                         <span className="uppercase tracking-wide highway-ghotic">
//                           {link.title}
//                         </span>
//                         <ChevronRight
//                           size={16}
//                           className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
//                         />
//                       </Link>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Support Section */}
//                 <div>
//                   <h3 className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3 mt-6">
//                     SUPPORT
//                   </h3>
//                   <div>
//                     <Link href="/support" className="w-full">
//                       <div className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800">
//                         <span>Email</span>
//                         <ChevronRight
//                           size={16}
//                           className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
//                         />
//                       </div>
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Account Actions Section */}
//                 <div>
//                   <h3 className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3 mt-6">
//                     ACCOUNT ACTIONS
//                   </h3>
//                   {!isUserLoggedIn && (
//                     <div>
//                       <Link href="/sign-in" className="w-full">
//                         <div className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800">
//                           <span className="highway-ghotic font-bold">
//                             Sign In
//                           </span>
//                           <ChevronRight
//                             size={16}
//                             className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
//                           />
//                         </div>
//                       </Link>
//                       <Link href="/create-account" className="w-full">
//                         <div className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group">
//                           <span className="highway-ghotic font-bold">
//                             Sign Up
//                           </span>
//                           <ChevronRight
//                             size={16}
//                             className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
//                           />
//                         </div>
//                       </Link>
//                     </div>
//                   )}

//                   {isUserLoggedIn && (
//                     <div>
//                       <Link href="#" className="w-full">
//                         <div
//                           onClick={handleSignOut}
//                           className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800"
//                         >
//                           <span className="highway-ghotic font-bold">
//                             Sign Out
//                           </span>
//                           <ChevronRight
//                             size={16}
//                             className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
//                           />
//                         </div>
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { navLinks } from "@/app/utils/Navlinks";
import { Button } from "../ui/button";
import { Menu, X, ChevronRight, ScanLine } from "lucide-react";
import { useIsUserLoggedInStore } from "@/store/userStore";
import ProfileAvatar from "./AvatarImage";

// Add props to accept QR scanner functions
interface NavbarProps {
  onJoinEvent?: () => void;
  showJoinButton?: boolean;
}

export default function Navbar({
  onJoinEvent,
  showJoinButton = false,
}: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isUserLoggedIn } = useIsUserLoggedInStore();

  useEffect(() => {
    // Set visible after component mounts to trigger animation
    setIsVisible(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    // Clear the authentication cookie
    clearCookie("token");
    clearCookie("refresh_token");
    // Clear all items in localStorage
    localStorage.clear();
    // Redirect to the sign-in page or home page
    window.location.href = "/sign-in";
  };

  const clearCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  const handleJoinClick = () => {
    if (onJoinEvent) {
      onJoinEvent();
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
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
              <Link href={"/"} className="text-xl font-bold">
                PXF
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-6">
                {navLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-gray-700 text-sm highway-ghotic tracking-widest hover:text-blue-600 uppercase font-semibold transition duration-200"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
                {/* Add Join Event button for desktop if showJoinButton is true */}
                {showJoinButton && (
                  <li className="mt-1">
                    <button
                      onClick={handleJoinClick}
                      className="text-gray-700 text-sm highway-ghotic tracking-widest cursor-pointer hover:text-blue-600 uppercase font-semibold transition duration-200 flex gap-1"
                    >
                      <ScanLine className="size-4" />
                      JOIN EVENT
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Authentication Buttons - Hidden on Mobile */}
          {!isUserLoggedIn && (
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
          )}
          {isUserLoggedIn && (
            <div className="hidden lg:flex items-center">
              <div>
                <ProfileAvatar />
              </div>
              <div className="w-full">
                <div
                  onClick={handleSignOut}
                  className="flex items-center justify-between text-gray-300 hover:text-white px-3 py-4 text-sm font-medium transition-all duration-200 border-gray-800 cursor-pointer"
                >
                  <Button className="h-8 font-bold text-sm bg-gray-200 text-primary hover:text-white">
                    SIGN OUT
                  </Button>

                  <ChevronRight
                    size={16}
                    className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed inset-0 bg-primary z-50 overflow-y-auto"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-800">
              <Link
                href={"/"}
                className="text-white font-bold text-xl tracking-wider"
              >
                PXF
              </Link>
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="px-4 py-4">
              <div className="space-y-6 pt-4">
                {/* Main Navigation */}
                <div>
                  {navLinks.map((link) => (
                    <div key={link.title}>
                      <Link
                        href={link.href}
                        className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800 last:border-b-0"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="uppercase tracking-wide highway-ghotic">
                          {link.title}
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
                        />
                      </Link>
                    </div>
                  ))}

                  {/* Add Join Event button for mobile if showJoinButton is true */}
                  {showJoinButton && (
                    <div>
                      <button
                        onClick={handleJoinClick}
                        className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800 w-full"
                      >
                        <span className="uppercase tracking-wide highway-ghotic flex items-center gap-2">
                          <ScanLine className="w-4 h-4" />
                          JOIN EVENT
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Support Section */}
                <div>
                  <h3 className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3 mt-6">
                    SUPPORT
                  </h3>
                  <div>
                    <Link href="/support" className="w-full">
                      <div className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800">
                        <span>Email</span>
                        <ChevronRight
                          size={16}
                          className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
                        />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Account Actions Section */}
                <div>
                  <h3 className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3 mt-6">
                    ACCOUNT ACTIONS
                  </h3>
                  {!isUserLoggedIn && (
                    <div>
                      <Link href="/sign-in" className="w-full">
                        <div className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800">
                          <span className="highway-ghotic font-bold">
                            Sign In
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
                          />
                        </div>
                      </Link>
                      <Link href="/create-account" className="w-full">
                        <div className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group">
                          <span className="highway-ghotic font-bold">
                            Sign Up
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
                          />
                        </div>
                      </Link>
                    </div>
                  )}

                  {isUserLoggedIn && (
                    <div>
                      <div className="w-full">
                        <div
                          onClick={handleSignOut}
                          className="flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-4 text-sm font-medium transition-all duration-200 group border-b border-gray-800 cursor-pointer"
                        >
                          <span className="highway-ghotic font-bold">
                            Sign Out
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
