"use client";
import React from "react";
import { motion } from "framer-motion";
import Button from "@/app/shared/ui/button";
import { TiArrowForward } from "react-icons/ti";
import { containerVariants, itemVariants } from "./Variants";

interface TitleSectionProps {
  isInView: boolean;
}

const TitleSection = React.forwardRef<HTMLDivElement, TitleSectionProps>(
  ({ isInView }, ref) => (
    <motion.div
      className="w-full flex flex-col justify-end items-start lg:col-span-5 lg:row-span-3 p-4"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="space-y-4 md:space-y-6 max-w-xl">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-100"
          variants={itemVariants}
        >
          The People <br className="hidden  sm:block" />
          Behind <br className="hidden sm:block" />
          <motion.span
            className="text-purple-500"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            SillaLink
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-gray-300 text-base md:text-lg"
          variants={itemVariants}
        >
          Silla-Link company have a passionate team of developers,
          designers, and innovators dedicated to crafting high-quality
          websites and applications that drive business growth. We combine
          cutting-edge technology with creative solutions to deliver
          digital experiences that users love.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button className="bg-primary rounded-2xl h-10 md:h-12 mt-2">
            About us
            <span className='ml-2'><TiArrowForward /></span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
);

TitleSection.displayName = "TitleSection";

export default TitleSection;