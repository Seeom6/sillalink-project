"use client";

import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-indego-dark flex items-center justify-center" role="status" aria-label="Loading">
      <div className="text-center">
        {/* Optimized Loading Animation */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Loading...</h2>
          <p className="text-gray-300 text-sm">Please wait while we prepare your content</p>
        </div>

        {/* Simple Pulsing Dots */}
        <div className="flex justify-center space-x-1 mt-6">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
