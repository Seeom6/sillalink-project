"use client";

import React, { useState, useCallback } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../ui/resizable-navbar";

// Navigation items configuration
const NAV_ITEMS: { name: string; link: string; }[] = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Services", link: "/services" },
  { name: "Projects", link: "/projects" },
  { name: "Team", link: "/team" },
];

export function MainNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={NAV_ITEMS} />
        <div className="flex items-center gap-4">
          <NavbarButton href="/contact" variant="primary">
            Contact
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={handleToggle}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen}>
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={`mobile-nav-${item.name}-${idx}`}
              href={item.link}
              onClick={handleClose}
              className="relative text-neutral-100 hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              href="/contact"
              onClick={handleClose}
              variant="primary"
              className="w-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              Contact
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
