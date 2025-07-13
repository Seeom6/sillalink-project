"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';
import { SectionLoader } from '@/components/ui/enhanced-loading';

// Lazy load sections for better performance
const HeroSection = dynamic(() => import('./components/home/Home.Section'), {
  ssr: true,
  loading: () => <div className="h-screen bg-indego-dark animate-pulse" />,
});

const AboutSection = dynamic(() => import('./components/about/About.Section'), {
  ssr: true,
  loading: () => <div className="h-96 bg-indego-dark animate-pulse" />,
});

const ServicesSection = dynamic(() => import('./components/services/Services.Section'), {
  ssr: true,
  loading: () => <div className="h-96 bg-indego-dark animate-pulse" />,
});

const ProjectsSection = dynamic(() => import('./components/projects/Projects.Section'), {
  ssr: true,
  loading: () => <div className="h-96 bg-indego-dark animate-pulse" />,
});

const WorkExperience = dynamic(() => import('./components/WorkExperience/Work.Section'), {
  ssr: true,
  loading: () => <div className="h-96 bg-indego-dark animate-pulse" />,
});

const ContactSection = dynamic(() => import('./components/contact/Contact.Section'), {
  ssr: true,
  loading: () => <div className="h-96 bg-indego-dark animate-pulse" />,
});

// Optimized decorative image component
const DecorativeImage = React.memo(({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className: string;
}) => (
  <div className="relative pointer-events-none" aria-hidden="true">
    <Image
      src={src}
      width={240}
      height={240}
      className={className}
      alt={alt}
      loading="lazy"
      quality={75}
    />
  </div>
));

DecorativeImage.displayName = 'DecorativeImage';

export default function HomePage() {
  return (
    <motion.div
      className="w-full relative overflow-hidden"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <motion.div variants={staggerItem}>
        <Suspense fallback={<div className="h-screen bg-transparent animate-pulse" />}>
          <HeroSection />
        </Suspense>
      </motion.div>

      {/* About Section */}
      <motion.div variants={staggerItem}>
        <SectionLoader isLoading={false}>
          <Suspense fallback={<div className="h-96 bg-transparent animate-pulse" />}>
            <AboutSection />
          </Suspense>
        </SectionLoader>
      </motion.div>

      {/* Services Section */}
      <motion.div variants={staggerItem}>
        <SectionLoader isLoading={false}>
          <Suspense fallback={<div className="h-96 bg-transparent animate-pulse" />}>
            <ServicesSection />
          </Suspense>
        </SectionLoader>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-1/3 left-0 transform -translate-x-1/2 z-0"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <DecorativeImage
          src="/assets/layer1.svg"
          alt="Decorative layer"
          className="w-60 hidden md:block opacity-30"
        />
      </motion.div>

      {/* Projects Section */}
      <motion.div variants={staggerItem}>
        <SectionLoader isLoading={false}>
          <Suspense fallback={<div className="h-96 bg-transparent animate-pulse" />}>
            <ProjectsSection />
          </Suspense>
        </SectionLoader>
      </motion.div>

      {/* Work Experience Section */}
      <motion.div variants={staggerItem}>
        <SectionLoader isLoading={false}>
          <Suspense fallback={<div className="h-96 bg-transparent animate-pulse" />}>
            <WorkExperience />
          </Suspense>
        </SectionLoader>
      </motion.div>

      {/* Second Decorative Element */}
      <motion.div
        className="absolute bottom-1/3 right-0 transform translate-x-1/2 z-0"
        animate={{
          y: [20, -20, 20],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <DecorativeImage
          src="/assets/layer2.svg"
          alt="Decorative layer"
          className="w-60 hidden md:block opacity-30"
        />
      </motion.div>

      {/* Contact Section */}
      <motion.div variants={staggerItem}>
        <SectionLoader isLoading={false}>
          <Suspense fallback={<div className="h-96 bg-transparent animate-pulse" />}>
            <ContactSection />
          </Suspense>
        </SectionLoader>
      </motion.div>
    </motion.div>
  );
}