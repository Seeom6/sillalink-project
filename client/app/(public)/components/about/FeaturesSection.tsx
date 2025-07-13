
"use client";
import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "./FeaturesCard";
import { FEATURES } from "../ui/content";

interface FeaturesSectionProps {
  isInView: boolean;
}

const FeaturesSection = React.forwardRef<HTMLDivElement, FeaturesSectionProps>(
  ({ isInView }, ref) => (
    <motion.div
      className="border border-gray-100 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 my-6 sm:my-10 md:my-16 max-w-4xl mx-auto w-full"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {FEATURES.map((feature, i) => (
          <FeatureCard 
            key={i} 
            feature={feature} 
            index={i} 
            isInView={isInView} 
          />
        ))}
      </div>
    </motion.div>
  )
);

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;