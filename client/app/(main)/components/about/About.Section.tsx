"use client";
import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Title from "../Title";
import TitleSection from "./TitleSection";
import TeamImages from "./TeamImages";
import NumberedSections from "./NumberedSections";
import MainImageWithFeatures from "./MainImageWithFeatures";
import ImageGallery from "./ImageGallery";

const AboutSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const numberedSectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Check if elements are in view
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.3 });
  const isNumberedSectionInView = useInView(numberedSectionRef, {
    once: true,
    amount: 0.3
  });
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const isGalleryInView = useInView(galleryRef, { once: true, amount: 0.3 });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.9, 1],
    [0.6, 1, 1, 0.6]
  );

  return (
    <motion.div
      id="about"
      className="w-full relative"
      ref={sectionRef}
      style={{ opacity, position: 'relative' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <section className="relative flex flex-col gap-8 max-w-[1260px] w-full mx-auto px-4 md:py-12 lg:py-16">
        <div className="w-full justify-center font-inspiration! items-center">
          <Title title1="About" title2="Us" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-4 lg:grid-rows-7">
          <TitleSection ref={titleRef} isInView={isTitleInView} />
          <TeamImages />
          <NumberedSections ref={numberedSectionRef} isInView={isNumberedSectionInView} />
          <MainImageWithFeatures ref={featuresRef} isInView={isFeaturesInView} />
          <ImageGallery ref={galleryRef} isInView={isGalleryInView} />
        </div>
      </section>
    </motion.div>
  );
};

export default AboutSection;