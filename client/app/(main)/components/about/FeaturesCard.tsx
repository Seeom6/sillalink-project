"use client";
import React from "react";
import { motion } from "framer-motion";
import { featureVariants } from "./Variants";

interface FeatureCardProps {
  feature: {
    icon: React.ReactNode;
    text: string;
  };
  index: number;
  isInView: boolean;
}

const FeatureCard = ({ feature, index, isInView }: FeatureCardProps) => (
  <motion.div
    className="flex flex-col items-center md:items-start gap-2 p-2 sm:p-3 md:p-4"
    custom={index}
    variants={featureVariants}
    initial="hidden"
    animate={isInView ? "visible" : "hidden"}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <motion.div
      initial={{ rotate: -10, opacity: 0 }}
      animate={isInView ? { rotate: 0, opacity: 1 } : { rotate: -10, opacity: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
    >
      {feature.icon}
    </motion.div>
    <motion.p
      className="text-xs sm:text-sm text-gray-300"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
    >
      {feature.text}
    </motion.p>
  </motion.div>
);

export default FeatureCard;