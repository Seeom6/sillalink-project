// app/layout.tsx
"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "./components/LeftSidebar";
import MobileHeader from "./components/MobileHeader";
import { PageTransition } from './components/PageTransition';
import Loading from "./components/LoadingSpinner";
import { AdminRouteGuard } from "@/components/guards";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <AdminRouteGuard>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {isLoading && <Loading  color="#fff"  size={40}/>}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <LeftSidebar />
        </div>

        {/* Mobile Header */}
        <MobileHeader />

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto pt-16 lg:pt-0 min-w-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 bg-[#F5F5F6] min-h-full safe-area-padding">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}