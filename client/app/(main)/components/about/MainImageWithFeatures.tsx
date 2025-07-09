"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import aboutSectionImage from "@/public/assets/aboutSectionImage.png";
import FeaturesSection from "./FeaturesSection";

interface MainImageWithFeaturesProps {
  isInView: boolean;
}

const MainImageWithFeatures = React.forwardRef<HTMLDivElement, MainImageWithFeaturesProps>(
  ({ isInView }, ref) => (
    <div className="w-full flex flex-col justify-center items-center lg:col-span-7 lg:row-span-3 lg:row-start-4 p-2 md:p-4 mt-6 lg:mt-0">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <Image
          src={aboutSectionImage}
          alt="Tech visualization"
          width={800}
          height={400}
          className="w-full object-cover"
          priority
        />
      </motion.div>
      
      <FeaturesSection ref={ref} isInView={isInView} />
    </div>
  )
);

MainImageWithFeatures.displayName = "MainImageWithFeatures";

export default MainImageWithFeatures;