"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUsers, FiFolder, FiBriefcase, FiSettings, FiLogOut, FiCode } from "react-icons/fi";
import { MdWork, MdDesignServices } from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";
// import logo from "@/public/Silla-Link-compnay.svg";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const LeftSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Role-based navigation items
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: <RiDashboardLine className="w-5 h-5" />,
      },
      {
        name: "Employees",
        href: "/admin/employees",
        icon: <FiUsers className="w-5 h-5" />,
      },
      {
        name: "Projects",
        href: "/admin/projects",
        icon: <FiFolder className="w-5 h-5" />,
      },
      {
        name: "Technologies",
        href: "/admin/technologies",
        icon: <FiCode className="w-5 h-5" />,
      },
      {
        name: "Experience",
        href: "/admin/experience",
        icon: <MdWork className="w-5 h-5" />,
      },
      {
        name: "Services",
        href: "/admin/services",
        icon: <MdDesignServices className="w-5 h-5" />,
      },
    ];

    // Only show Settings for admin role
    if (user?.role === 'admin') {
      baseItems.push({
        name: "Settings",
        href: "/admin/settings",
        icon: <FiSettings className="w-5 h-5" />,
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <motion.div 
      className="sticky inset-y-0 left-0 z-50 w-72 h-full bg-indego-dark border-r border-gray-200 flex flex-col"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center justify-center h-16 mt-20 mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/" className="text-xl font-semibold w-full flex justify-center flex-col items-center text-gray-800">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/Silla-Link-compnay.svg" alt={"silla Link Logo"} width={128} height={128} className="w-32"/>
          </motion.div>
          <motion.p 
            className="text-medium mt-3 text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-primary">SillaLink</span>–Company
          </motion.p>
        </Link>
      </motion.div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              onHoverStart={() => setIsHovered(item.name)}
              onHoverEnd={() => setIsHovered(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center p-3 text-regular rounded-lg text-white relative overflow-hidden ${
                  isMounted && pathname === item.href
                    ? "bg-white/10 font-semibold text-xl"
                    : "text-gray-700 hover:bg-white/10"
                }`}
              >
                <AnimatePresence>
                  {isHovered === item.name && (
                    <motion.span
                      className="absolute inset-0 bg-white/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <motion.span 
                  className="mr-3"
                  animate={{
                    scale: isMounted && pathname === item.href ? 1.1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {item.icon}
                </motion.span>
                <motion.span 
                  className="font-medium"
                  animate={{
                    x: isMounted && pathname === item.href ? 5 : 0
                  }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      {user && (
        <motion.div
          className="p-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-white">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-white/70">{user.email}</p>
              <p className="text-xs text-white/70 capitalize">Role: {user.role}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logout Button */}
      <motion.div
        className="p-4 border-t border-gray-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-white/10 hover:text-xl transition-colors"
          whileHover={{ 
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            paddingLeft: "1.5rem"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span 
            animate={{
              rotate: isHovered === "logout" ? 20 : 0
            }}
          >
            <FiLogOut className="w-5 h-5 mr-3 text-white" />
          </motion.span>
          <span className="font-medium text-white">Logout</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LeftSidebar;