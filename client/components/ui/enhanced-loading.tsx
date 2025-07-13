"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Branded Loading Screen Component
export const BrandedLoadingScreen: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indego-dark via-indego-darker to-dark-950"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-purple/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(121,22,255,0.1),transparent_50%)]" />
          </div>
          
          {/* Loading Content */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Logo with Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full" />
              <Image
                src="/assets/Silla-Link-compnay.svg"
                alt="Silla Link"
                width={120}
                height={120}
                className="relative z-10 w-24 h-24 md:w-32 md:h-32"
                priority
              />
            </motion.div>
            
            {/* Company Name */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Silla Link
              </h1>
              <p className="text-gray-300 text-lg">Software Development Excellence</p>
            </motion.div>
            
            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Animated Progress Bar */}
              <div className="w-64 h-1 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/3 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full"
                />
              </div>
              
              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-gray-400 text-sm"
              >
                Loading amazing experiences...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Skeleton Loading Components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gradient-to-r from-dark-800 to-dark-700 rounded-xl p-6 space-y-4">
      <div className="h-4 bg-gradient-to-r from-dark-600 to-dark-500 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gradient-to-r from-dark-600 to-dark-500 rounded"></div>
        <div className="h-3 bg-gradient-to-r from-dark-600 to-dark-500 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-gradient-to-r from-primary-800 to-primary-700 rounded w-1/3"></div>
    </div>
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = "" 
}) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-3 bg-gradient-to-r from-dark-600 to-dark-500 rounded ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export const SkeletonImage: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gradient-to-br from-dark-700 to-dark-600 rounded-lg flex items-center justify-center">
      <svg
        className="w-12 h-12 text-dark-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

// Section Loading Component
export const SectionLoader: React.FC<{ 
  isLoading: boolean; 
  children: React.ReactNode;
  className?: string;
}> = ({ isLoading, children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
