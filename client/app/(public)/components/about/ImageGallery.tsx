"use client";
import React from "react";
import { motion } from "framer-motion";
import { containerVariants } from "./Variants";
import GalleryImage from "./GalleryImage";
import about1 from "@/public/assets/about1.png";
import about2 from "@/public/assets/about2.png";
import about3 from "@/public/assets/about3.png";

interface ImageGalleryProps {
  isInView: boolean;
}

const GALLERY_IMAGES = [about1, about2, about3];

const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  ({ isInView }, ref) => (
    <motion.div
      className="lg:col-span-12 lg:row-span-2 p-2 md:p-4 mt-4 lg:mt-0"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {GALLERY_IMAGES.map((src, i) => (
          <GalleryImage 
            key={i} 
            src={src} 
            index={i} 
            isInView={isInView} 
            isWide={i === 2} 
          />
        ))}
      </div>
    </motion.div>
  )
);

ImageGallery.displayName = "ImageGallery";

export default ImageGallery;