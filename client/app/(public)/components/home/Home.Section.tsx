"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { icons } from "../ui/icons";
import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";
import { Spotlight } from "../ui/Spotlight";
import CodeAnimation from "./Code.Animation";
import { TiArrowForward } from "react-icons/ti";
import { CTAButton, OutlineButton } from '@/components/ui/enhanced-button';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } from '@/lib/animations/variants';

const HeroSection = () => {
  return (
    <motion.div
      id="home"
      className="w-full flex flex-col justify-center items-center mb-26 py-20"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="w-full flex flex-col justify-between lg:h-screen items-center max-w-[1260px] p-3 relative overflow-hidden md:flex-row">
        {/* Enhanced Spotlights */}
        <Spotlight
          className="top-0 left-1/2 -translate-x-1/2 h-[66vh] w-[50wh]"
          fill="white"
        />
        <Spotlight
          className="top-[34rem] left-[80rem] h-[66vh] w-[50wh]"
          fill="#7916ff"
        />
        <Spotlight
          className="top-[27rem] left-[10rem] h-[66vh] w-[50wh]"
          fill="#9f75ff"
        />

        {/* Hero Content */}
        <motion.div
          className="w-full flex flex-col justify-center z-10 text-center lg:text-start"
          variants={fadeInLeft}
        >
          <motion.div variants={staggerItem}>
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary-500/20 to-accent-purple/20 border border-primary-500/30 rounded-full text-sm text-primary-300 mb-6 backdrop-blur-sm">
              ✨ Start your digital journey with us now!
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mt-4 leading-tight"
            variants={staggerItem}
          >
            <span className="bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent">
              Sillalink –
            </span>
            <br />
            <span className="text-white">Where Ideas Become</span>
            <br />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Digital Reality!
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 mt-6 max-w-2xl leading-relaxed"
            variants={staggerItem}
          >
            In <span className="text-primary-400 font-semibold">Sillalink</span>, we help
            businesses transition into the digital future with innovative,
            customized software solutions that meet your unique needs. We provide
            you with cutting-edge technologies to ensure success and growth in
            the fast-changing world of business.
          </motion.p>

          <motion.div
            className="mt-8 flex gap-4 justify-center lg:justify-start items-center flex-wrap"
            variants={staggerItem}
          >
            <CTAButton
              size="lg"
              icon={<TiArrowForward />}
              iconPosition="right"
              className="shadow-2xl"
            >
              See our work
            </CTAButton>
            <OutlineButton size="lg">
              Let's Talk
            </OutlineButton>
          </motion.div>
        </motion.div>
        {/* Code Animation */}
        <motion.div
          className="w-full flex justify-center z-10"
          variants={fadeInRight}
        >
          <CodeAnimation />
        </motion.div>
      </div>

      {/* Moving Cards Section */}
      <motion.div
        className="w-full shadow-white bg-[rgba(28,27,51,0.2)] backdrop-blur-lg lg:rounded-4xl overflow-hidden relative before:content-[''] before:absolute before:inset-0 before:opacity-50 before:pointer-events-none max-w-[1260px] flex justify-center items-center mt-12"
        variants={fadeInUp}
      >
        <InfiniteMovingCards items={icons} speed="normal" />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
