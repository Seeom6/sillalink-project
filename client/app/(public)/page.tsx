"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
    <div className="w-full relative overflow-hidden bg-indego-dark">
      <Suspense fallback={<div className="h-screen bg-indego-dark animate-pulse" />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-indego-dark animate-pulse" />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-indego-dark animate-pulse" />}>
        <ServicesSection />
      </Suspense>

      <DecorativeImage
        src="/assets/layer1.svg"
        alt="Decorative layer"
        className="w-60 absolute hidden md:block left-[-100px] opacity-50 z-0"
      />

      <Suspense fallback={<div className="h-96 bg-indego-dark animate-pulse" />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-indego-dark animate-pulse" />}>
        <WorkExperience />
      </Suspense>

      <DecorativeImage
        src="/assets/layer2.svg"
        alt="Decorative layer"
        className="w-60 absolute hidden md:block right-[-100px] opacity-50 z-0"
      />

      <Suspense fallback={<div className="h-96 bg-indego-dark animate-pulse" />}>
        <ContactSection />
      </Suspense>
    </div>
  );
}