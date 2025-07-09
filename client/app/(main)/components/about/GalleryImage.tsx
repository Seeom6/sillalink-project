"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { galleryItemVariants } from "./Variants";

interface GalleryImageProps {
  src: any;
  index: number;
  isInView: boolean;
  isWide: boolean;
}

const GalleryImage = ({ src, index, isInView, isWide }: GalleryImageProps) => (
  <motion.div
    className={`h-[150px] sm:h-[180px] md:h-[200px] rounded-lg overflow-hidden ${
      isWide ? "sm:col-span-2 md:col-span-1" : ""
    }`}
    custom={index}
    variants={galleryItemVariants}
    whileHover={{
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    }}
  >
    <Image
      src={src}
      alt={`Gallery image ${index + 1}`}
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
    />
  </motion.div>
);

export default GalleryImage;