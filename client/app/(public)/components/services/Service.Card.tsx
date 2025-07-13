"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features }) => {
  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 h-full hover:border-primary/50 transition-all duration-300 group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center text-sm text-gray-400"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <FiCheck className="text-primary mr-3 flex-shrink-0" size={16} />
            <span>{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* Learn More Link */}
      <motion.div
        className="flex items-center text-primary font-medium cursor-pointer group-hover:text-primary/80 transition-colors duration-300"
        whileHover={{ x: 5 }}
      >
        <span className="mr-2">Learn More</span>
        <FiArrowRight size={16} />
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
