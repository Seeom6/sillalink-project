"use client"
import Footer from "./components/Footer";

import { MainNavbar } from "./components/header/MainNavbar";
import { Poppins, Inspiration } from 'next/font/google';
import { usePathname } from 'next/navigation';

// Load Poppins (with multiple weights)
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

// Load Inspiration (handwriting font, single weight)
const inspiration = Inspiration({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-inspiration',
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // Define paths where header and footer should be hidden
  const hideHeaderPaths = ["/verification" , "/forget-password" , "/reset-pass"];
  const hideFooterPaths = ['/login', '/register', ...hideHeaderPaths];
  const shouldHideFooter = hideFooterPaths.includes(pathname);
  const shouldHideHeader = hideHeaderPaths.includes(pathname);

  return (
    <div className={`${poppins.variable} ${inspiration.variable} font-sans`}>
      <main lang="en" className="relative mx-auto bg-indego-dark py-4">
      {!shouldHideHeader && <MainNavbar />}
        {children}
        {!shouldHideFooter && <Footer />}
      </main>
    </div>
  );
}