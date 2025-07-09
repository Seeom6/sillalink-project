"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import team1 from "@/public/assets/team1.png";
import team3 from "@/public/assets/team3.png";
import { imageVariants } from "./Variants";

const TeamImages = () => (
  <div className="flex w-full gap-4 md:gap-6 lg:col-span-7 lg:row-span-2 p-2 md:p-4">
    {[team1, team3].map((src, i) => (
      <motion.div
        key={i}
        className="w-full sm:w-1/2"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
        transition={{ delay: i * 0.2 }}
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      >
        <Image
          src={src}
          alt="Team member"
          className={`rounded-lg rounded-br-[80px] sm:rounded-br-[120px] md:rounded-br-[180px] 
            rounded-bl-[80px] sm:rounded-bl-[120px] md:rounded-bl-[180px] 
            w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover`}
          priority
        />
      </motion.div>
    ))}
  </div>
);

export default TeamImages;