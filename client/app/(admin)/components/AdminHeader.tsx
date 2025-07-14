'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { useAuth } from '@/lib/hooks/use-auth';
import Link from 'next/link';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen = false,
  className = ''
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  // State management
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'New user registered',
      message: 'John Doe just created an account',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Server maintenance',
      message: 'Scheduled maintenance at 2:00 AM',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Backup completed',
      message: 'Daily backup finished successfully',
      time: '3 hours ago',
      unread: false
    }
  ];

  const handleSignOut = async () => {
    console.log('Sign out clicked');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-xl ${className}`}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Logo & Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          {onToggleSidebar && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary/20 lg:hidden"
            >
              <AnimatePresence mode="wait">
                {isSidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}

          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <Image
                src="/assets/Silla-Link-compnay.svg"
                alt="Silla Link"
                width={40}
                height={40}
                className="relative z-10 w-8 h-8 md:w-10 md:h-10"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground">Silla Link</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Right Section - Search, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative hidden md:block"
          >
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-64 pl-10 pr-4 py-2 bg-dark-800/50 border border-primary-500/20 rounded-xl
                text-white placeholder-primary-400 focus:outline-none focus:border-primary-500/50
                focus:bg-dark-800/70 transition-all duration-200
              "
            />
          </motion.div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="
              relative p-2 text-primary-300 hover:text-white hover:bg-primary-500/20 
              rounded-lg transition-colors duration-200
            "
            aria-label="Notifications"
          >
            <FiBell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-900" />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="
              p-2 text-primary-300 hover:text-white hover:bg-primary-500/20 
              rounded-lg transition-colors duration-200
            "
            aria-label="Settings"
          >
            <FiSettings size={20} />
          </motion.button>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 p-2 hover:bg-primary-500/10 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-purple rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-white text-sm font-medium">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-primary-400 text-xs">
                Administrator
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
