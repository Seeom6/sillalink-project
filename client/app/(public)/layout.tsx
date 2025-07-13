"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Poppins, Inspiration } from 'next/font/google';
import dynamic from 'next/dynamic';
import { BrandedLoadingScreen } from '@/components/ui/enhanced-loading';

// Optimized font loading
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

const inspiration = Inspiration({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-inspiration',
  display: 'swap',
  preload: false,
});

// Lazy load components for better performance
const MainNavbar = dynamic(() => import('./components/header/MainNavbar').then(mod => ({ default: mod.MainNavbar })), {
  ssr: true,
  loading: () => <div className="h-16 bg-indego-dark" />,
});

const Footer = dynamic(() => import('./components/Footer'), {
  ssr: true,
  loading: () => <div className="h-32 bg-indego-dark" />,
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-indego-dark flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Define paths where header and footer should be hidden
  const hideHeaderPaths = ["/verification", "/forget-password", "/reset-pass"];
  const hideFooterPaths = ['/login', '/register', ...hideHeaderPaths];
  const shouldHideFooter = hideFooterPaths.includes(pathname);
  const shouldHideHeader = hideHeaderPaths.includes(pathname);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Branded Loading Screen */}
      <BrandedLoadingScreen isLoading={isInitialLoading} />

      <div className={`${poppins.variable} ${inspiration.variable} font-sans antialiased`}>
        {!shouldHideHeader && (
          <Suspense fallback={<div className="h-16 bg-indego-dark" />}>
            <MainNavbar />
          </Suspense>
        )}

        <main lang="en" className="relative min-h-screen bg-gradient-to-br from-indego-dark via-indego-darker to-dark-950">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(121,22,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent_50%)]" />
          </div>

          <Suspense fallback={<PageLoader />}>
            <div className="relative z-10">
              {children}
            </div>
          </Suspense>
        </main>

        {!shouldHideFooter && (
          <Suspense fallback={<div className="h-32 bg-indego-dark" />}>
            <Footer />
          </Suspense>
        )}
      </div>
    </>
  );
}