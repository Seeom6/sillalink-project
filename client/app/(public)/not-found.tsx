"use client";

import React from 'react';
import Link from 'next/link';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage: React.FC = () => {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-indego-dark flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4" aria-label="Error 404">
            404
          </h1>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-indego-dark"
          >
            <FiHome className="mr-2" size={20} aria-hidden="true" />
            Go Home
          </Link>

          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-8 py-4 border border-primary text-primary font-semibold rounded-2xl hover:bg-primary hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-indego-dark"
          >
            <FiArrowLeft className="mr-2" size={20} aria-hidden="true" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-400 mb-4">Looking for something specific?</p>
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-primary hover:text-primary/80 transition-colors duration-300 focus:outline-none focus:underline">
              About Us
            </Link>
            <Link href="/services" className="text-primary hover:text-primary/80 transition-colors duration-300 focus:outline-none focus:underline">
              Services
            </Link>
            <Link href="/projects" className="text-primary hover:text-primary/80 transition-colors duration-300 focus:outline-none focus:underline">
              Projects
            </Link>
            <Link href="/team" className="text-primary hover:text-primary/80 transition-colors duration-300 focus:outline-none focus:underline">
              Team
            </Link>
            <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors duration-300 focus:outline-none focus:underline">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
