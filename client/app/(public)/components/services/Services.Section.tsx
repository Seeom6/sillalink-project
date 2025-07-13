"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Title from '../Title';
import ServiceCard from './Service.Card';
import { 
  FiCode, 
  FiSmartphone, 
  FiCloud, 
  FiDatabase, 
  FiShield, 
  FiTrendingUp 
} from 'react-icons/fi';

const ServicesSection = () => {
  const services = [
    {
      icon: <FiCode size={32} className="text-primary" />,
      title: "Web Development",
      description: "Custom web applications built with modern technologies like React, Next.js, and Node.js for optimal performance and user experience.",
      features: ["Responsive Design", "SEO Optimization", "Performance Tuning", "Modern Frameworks"]
    },
    {
      icon: <FiSmartphone size={32} className="text-primary" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter technologies.",
      features: ["Cross-Platform", "Native Performance", "App Store Deployment", "Push Notifications"]
    },
    {
      icon: <FiCloud size={32} className="text-primary" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud platforms.",
      features: ["Auto Scaling", "Load Balancing", "CI/CD Pipelines", "Monitoring & Analytics"]
    },
    {
      icon: <FiDatabase size={32} className="text-primary" />,
      title: "Backend Development",
      description: "Robust backend systems and APIs using NestJS, Express, and microservices architecture for enterprise applications.",
      features: ["RESTful APIs", "Microservices", "Database Design", "Real-time Features"]
    },
    {
      icon: <FiShield size={32} className="text-primary" />,
      title: "Security & Authentication",
      description: "Comprehensive security solutions including authentication, authorization, and data protection for your applications.",
      features: ["JWT Authentication", "Role-based Access", "Data Encryption", "Security Audits"]
    },
    {
      icon: <FiTrendingUp size={32} className="text-primary" />,
      title: "Digital Transformation",
      description: "Complete digital transformation services to modernize your business processes and improve operational efficiency.",
      features: ["Process Automation", "Legacy Migration", "Digital Strategy", "Technology Consulting"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-indego-dark">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title Section */}
        <div className="text-center mb-16">
          <Title title1="Our" title2="Services" />
          <motion.p 
            className="text-gray-300 text-lg max-w-3xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We offer comprehensive software development services to help your business 
            thrive in the digital world. From web applications to mobile apps and cloud solutions.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your ideas into powerful digital solutions 
            that drive your business forward.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
