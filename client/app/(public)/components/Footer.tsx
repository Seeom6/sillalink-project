"use client";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
// import logo from "@/public/assets/Silla-Link-compnay.svg";
import { useEffect, useState } from 'react';

interface NavLink {
  name: string;
  href: string;
}

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const links: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
    { name: 'Log in', href: '/login' },
    { name: 'sign up', href: '/signup' },
  ];

  const legalLinks: NavLink[] = [
    { name: 'Terms of Service', href: '/' },
    { name: 'Privacy Policy', href: '/' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!isMounted) {
    return (
      <footer className="bg-indego-dark text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Static version for SSR */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/Silla-Link-compnay.svg"
                  alt="Sillalink Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:flex gap-6 md:gap-10">
              {links.map((link) => (
                <Link key={link.name} href={link.href} className="text-primary hover:text-white transition-colors duration-200">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800 my-6" />

          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} All rights reserved by Sillalink Company
            </p>

            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-gray-400 hover:text-white text-sm">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-indego-dark text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Animated version for client */}
        <AnimatePresence>
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/Silla-Link-compnay.svg"
                  alt="Sillalink Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="w-full flex gap-2 font-bold text-small justify-center md:justify-end md:flex md:gap-6 flex-wrap"
            >
              {links.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link 
                    href={link.href}
                    className="text-primary hover:text-white transition-colors duration-200"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="block"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="border-t border-gray-800 my-6"
        />

        <AnimatePresence>
          <motion.div
            className="flex flex-col-reverse md:flex-row justify-between items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-sm"
            >
              &copy; {currentYear} All rights reserved by Sillalink Company
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="flex gap-6"
            >
              {legalLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="block"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </footer>
  );
};

export default Footer;