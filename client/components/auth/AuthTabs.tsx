"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AuthTabsProps {
  activeTab: "login" | "signup";
  setActiveTab: (tab: "login" | "signup") => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, setActiveTab }) => {
  const pathname = usePathname();
  
  return (
    <div className="flex mb-8">
      <div className="flex bg-gray-700/50 rounded-full p-1 w-full">
        <Link
          href="/auth/login"
          className={`flex-1 text-center py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            pathname === '/auth/login' || activeTab === 'login'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className={`flex-1 text-center py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            pathname === '/auth/register' || activeTab === 'signup'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Register
        </Link>
      </div>
    </div>
  );
};
