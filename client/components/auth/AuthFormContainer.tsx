"use client";

import React from 'react';

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right decorative shape */}
        <div className="absolute top-8 right-8 w-16 h-16 bg-purple-500/20 rounded-lg transform rotate-45"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-purple-400/30 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-blue-400/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-pink-400/30 rounded-full"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center lg:justify-between relative z-10">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="relative">
            {/* Main illustration container */}
            <div className="relative w-96 h-96">
              {/* Background cards/documents */}
              <div className="absolute top-0 left-0 w-64 h-80 bg-gray-200 rounded-lg transform -rotate-12 shadow-lg"></div>
              <div className="absolute top-4 left-8 w-64 h-80 bg-white rounded-lg transform -rotate-6 shadow-lg"></div>
              
              {/* Mobile phone mockup */}
              <div className="absolute top-8 left-16 w-48 h-80 bg-gray-800 rounded-3xl shadow-2xl border-4 border-gray-700">
                {/* Phone screen */}
                <div className="w-full h-full bg-white rounded-2xl m-1 p-4 flex flex-col">
                  {/* Phone header */}
                  <div className="w-full h-6 bg-gray-100 rounded-t-2xl mb-4 flex items-center justify-center">
                    <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  
                  {/* User icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Form lines */}
                  <div className="space-y-3 mb-4">
                    <div className="h-2 bg-purple-200 rounded w-3/4"></div>
                    <div className="h-2 bg-purple-200 rounded w-full"></div>
                    <div className="h-2 bg-purple-200 rounded w-2/3"></div>
                  </div>
                  
                  {/* Password dots */}
                  <div className="flex space-x-1 mb-6">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  
                  {/* Sign up button */}
                  <div className="bg-purple-500 text-white text-xs py-2 px-4 rounded text-center">
                    SIGN UP
                  </div>
                </div>
              </div>
              
              {/* Character illustration */}
              <div className="absolute bottom-0 left-0 w-32 h-40">
                {/* Simple character representation */}
                <div className="relative">
                  {/* Head */}
                  <div className="w-8 h-8 bg-amber-200 rounded-full mx-auto mb-2"></div>
                  {/* Body */}
                  <div className="w-12 h-16 bg-purple-600 rounded-lg mx-auto mb-2"></div>
                  {/* Arms */}
                  <div className="absolute top-8 -left-2 w-6 h-2 bg-amber-200 rounded-full transform rotate-45"></div>
                  <div className="absolute top-8 -right-2 w-6 h-2 bg-amber-200 rounded-full transform -rotate-45"></div>
                  {/* Legs */}
                  <div className="w-3 h-8 bg-gray-800 rounded-lg inline-block mr-2"></div>
                  <div className="w-3 h-8 bg-gray-800 rounded-lg inline-block"></div>
                </div>
              </div>
              
              {/* Security/lock elements */}
              <div className="absolute top-16 right-0 w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center transform rotate-12">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Additional decorative elements */}
              <div className="absolute bottom-16 right-8 w-12 h-12 bg-purple-400 rounded-lg transform rotate-45 opacity-80"></div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700/50">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
              <p className="text-gray-300 text-sm">{subtitle}</p>
            </div>

            {/* Form content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
