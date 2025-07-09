"use client";
import React from "react";
import { motion } from "framer-motion";
import { NUMBERED_SECTIONS } from "@/app/shared/data/content";
import { containerVariants, numberVariants } from "./Variants";

interface NumberedSectionsProps {
  isInView: boolean;
}

const NumberedSections = React.forwardRef<HTMLDivElement, NumberedSectionsProps>(
  ({ isInView }, ref) => (
    <motion.div
      className="lg:col-span-4 lg:col-start-9 lg:row-span-3 p-4"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="space-y-8 md:space-y-12 lg:space-y-16">
        {NUMBERED_SECTIONS.map((text, i) => (
          <motion.div
            key={i}
            className="space-y-3 md:space-y-4"
            custom={i}
            variants={numberVariants}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="h-1 w-12 md:w-16 bg-purple-600"
                initial={{ width: 0 }}
                animate={isInView ? { width: "4rem" } : { width: 0 }}
                transition={{ delay: i * 0.2 + 0.3, duration: 0.5 }}
              />
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-gray-100"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
              >
                {i < 9 ? `0${i + 1}` : i + 1}
              </motion.h2>
            </div>
            <motion.p
              className="text-gray-100 text-sm md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: i * 0.2 + 0.7, duration: 0.5 }}
            >
              {text}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
);

NumberedSections.displayName = "NumberedSections";

export default NumberedSections;