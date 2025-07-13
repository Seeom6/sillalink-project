"use client";

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Poppins, Inspiration } from 'next/font/google';
import dynamic from 'next/dynamic';

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

  // Define paths where header and footer should be hidden
  const hideHeaderPaths = ["/verification", "/forget-password", "/reset-pass"];
  const hideFooterPaths = ['/login', '/register', ...hideHeaderPaths];
  const shouldHideFooter = hideFooterPaths.includes(pathname);
  const shouldHideHeader = hideHeaderPaths.includes(pathname);

  return (
    <div className={`${poppins.variable} ${inspiration.variable} font-sans antialiased`}>
      {!shouldHideHeader && (
        <Suspense fallback={<div className="h-16 bg-indego-dark" />}>
          <MainNavbar />
        </Suspense>
      )}

      <main lang="en" className="relative min-h-screen bg-indego-dark">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>

      {!shouldHideFooter && (
        <Suspense fallback={<div className="h-32 bg-indego-dark" />}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}