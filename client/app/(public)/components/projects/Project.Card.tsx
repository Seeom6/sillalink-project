"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink, FiTag } from "react-icons/fi";

interface ProjectIcon {
  name: string;
  icon: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  children?: ReactNode;
  icons?: ProjectIcon[];
  category?: string;
  status?: string;
  link?: string;
}
function ProjectCard({
  title,
  description,
  imageUrl,
  icons,
  category,
  status,
  link = "#"
}: ProjectCardProps) {
  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Image */}
      {imageUrl && (
        <div className="h-48 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Status Badge */}
          {status && (
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === 'Completed'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {status}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Category */}
        {category && (
          <div className="flex items-center mb-3">
            <FiTag className="text-primary mr-2" size={14} />
            <span className="text-primary text-sm font-medium">{category}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icons?.slice(0, 4).map((tech, idx) => (
              <div key={idx} className="relative group/tech">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg bg-gray-800 p-1"
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {tech.name}
                </div>
              </div>
            ))}
            {icons && icons.length > 4 && (
              <span className="text-gray-400 text-sm">+{icons.length - 4}</span>
            )}
          </div>

          {/* View Project Link */}
          <motion.a
            href={link}
            className="flex items-center text-primary hover:text-primary/80 transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            <span className="mr-2 text-sm font-medium">View</span>
            <FiExternalLink size={16} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
