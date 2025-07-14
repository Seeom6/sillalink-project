"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiFolderPlus,
  FiCode,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiGlobe,
  FiSettings
} from 'react-icons/fi';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useAuth } from '@/lib/hooks/use-auth';

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
  description?: string;
}



const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: FiHome,
    description: 'Overview and analytics'
  },
  {
    id: 'users',
    label: 'Users',
    href: '/admin/users',
    icon: FiUsers,
    badge: 3,
    description: 'Manage user accounts'
  },
  {
    id: 'employees',
    label: 'Employees',
    href: '/admin/employees',
    icon: FiUsers,
    badge: 12,
    description: 'Employee management'
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/admin/projects',
    icon: FiFolderPlus,
    badge: 8,
    description: 'Project management'
  },
  {
    id: 'technologies',
    label: 'Technologies',
    href: '/admin/technologies',
    icon: FiCode,
    description: 'Tech stack management'
  },
  {
    id: 'services',
    label: 'Services',
    href: '/admin/services',
    icon: FiGlobe,
    description: 'Service offerings'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: FiSettings,
    description: 'System settings and configuration'
  }
];

export const AdminSidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <motion.button
          onClick={toggleMobile}
          className="fixed top-4 left-4 z-50 p-3 bg-dark-800/90 backdrop-blur-sm border border-primary-500/20 rounded-xl text-white hover:bg-dark-700/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle mobile menu"
        >
          {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </motion.button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px',
          x: isMobile ? (isMobileOpen ? 0 : '-100%') : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          h-full bg-dark-900/95 backdrop-blur-xl border-r border-primary-500/20 flex-shrink-0
          ${isMobile ? 'fixed top-0 left-0 z-50' : 'relative z-auto'}
          ${className}
        `}
        style={{
          minWidth: isCollapsed ? '80px' : '280px',
          maxWidth: isCollapsed ? '80px' : '280px'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-primary-500/20">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image
                    src="/assets/Silla-Link-compnay.svg"
                    alt="Silla Link Company Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                {!isCollapsed && (
                  <div>
                    <h1 className="text-white font-bold text-lg">SillaLink</h1>
                    <p className="text-primary-300 text-sm">Company</p>
                  </div>
                )}
              </motion.div>

              {/* Collapse Toggle (Desktop only) */}
              <motion.button
                onClick={toggleCollapse}
                className="hidden lg:flex p-2 text-primary-300 hover:text-white hover:bg-primary-500/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
              </motion.button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-primary-500/20">
            <motion.div
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-purple rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('') : 'AD'}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {user?.name || 'Admin User'}
                  </h3>
                  <p className="text-primary-300 text-xs truncate">
                    {user?.role || 'Administrator'}
                  </p>
                  <p className="text-primary-400 text-xs truncate">
                    {user?.email || 'admin@sillalink.com'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={`
                      group relative flex items-center px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent-purple/20 border border-primary-500/30 text-white shadow-lg shadow-primary-500/10'
                        : 'text-primary-300 hover:text-white hover:bg-primary-500/10 border border-transparent hover:border-primary-500/20'
                      }
                    `}
                    aria-label={item.description}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-400 to-accent-purple rounded-r-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <Icon
                      size={20}
                      className={`
                        flex-shrink-0 transition-colors duration-200
                        ${isActive ? 'text-primary-400' : 'text-current'}
                      `}
                    />

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 flex-1 flex items-center justify-between"
                        >
                          <span className="font-medium text-sm">
                            {item.label}
                          </span>
                          {item.badge && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2 px-2 py-1 bg-accent-purple/20 text-accent-purple text-xs font-semibold rounded-full border border-accent-purple/30"
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-primary-500/20">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 bg-accent-purple/20 text-accent-purple text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-primary-500/20">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <EnhancedButton
                onClick={handleLogout}
                disabled={isLoading}
                variant="ghost"
                className={`
                  w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/30
                  ${isCollapsed ? 'px-3' : 'px-4'}
                `}
                aria-label="Logout from admin panel"
              >
                <FiLogOut size={20} className="flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 font-medium text-sm"
                    >
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </EnhancedButton>
            </motion.div>

            {/* Tooltip for collapsed logout */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-primary-500/20">
                Logout
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
