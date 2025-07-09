"use client";

import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import LeftSidebar from "./LeftSidebar";

const MobileHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-4 safe-area-padding">
        {/* Static version for SSR */}
        <div className="ml-4 text-lg sm:text-xl font-semibold text-gray-800">
          <span className="text-primary">SillaLink</span> Admin
        </div>
      </header>
    );
  }
  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-4 safe-area-padding">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <div className="ml-4 text-lg sm:text-xl font-semibold text-gray-800">
          <span className="text-primary">SillaLink</span> Admin
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-72 sm:w-80 bg-white shadow-xl">
            <LeftSidebar />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;