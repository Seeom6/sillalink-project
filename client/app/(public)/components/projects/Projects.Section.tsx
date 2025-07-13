"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Title from '../Title';
import ProjectCard from './Project.Card';

const ProjectsSection = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A comprehensive e-commerce solution with advanced features including inventory management, payment processing, and analytics dashboard.",
      imageUrl: "/assets/scentora.svg",
      icons: [
        { name: "React", icon: "/assets/ReactIcon.svg" },
        { name: "Node.js", icon: "/assets/NodeIcon.svg" },
        { name: "MongoDB", icon: "/assets/MongoIcon.svg" },
        { name: "TypeScript", icon: "/assets/TypeScriptIcon.svg" }
      ],
      category: "Web Application",
      status: "Completed",
      link: "#"
    },
    {
      title: "Healthcare Management System",
      description: "Digital transformation solution for healthcare providers with patient management, appointment scheduling, and telemedicine capabilities.",
      imageUrl: "/assets/mechanic.svg",
      icons: [
        { name: "Next.js", icon: "/assets/NextIcon.svg" },
        { name: "NestJS", icon: "/assets/nestjs.svg" },
        { name: "PostgreSQL", icon: "/assets/MongoIcon.svg" },
        { name: "TypeScript", icon: "/assets/TypeScriptIcon.svg" }
      ],
      category: "Healthcare",
      status: "In Progress",
      link: "#"
    },
    {
      title: "Food Delivery App",
      description: "Mobile-first food delivery platform with real-time tracking, payment integration, and restaurant management system.",
      imageUrl: "/assets/sillaFood.svg",
      icons: [
        { name: "React Native", icon: "/assets/ReactIcon.svg" },
        { name: "Node.js", icon: "/assets/NodeIcon.svg" },
        { name: "MongoDB", icon: "/assets/MongoIcon.svg" },
        { name: "Flutter", icon: "/assets/FlutterIcon.svg" }
      ],
      category: "Mobile App",
      status: "Completed",
      link: "#"
    },
    {
      title: "Business Analytics Dashboard",
      description: "Comprehensive analytics platform providing real-time insights, data visualization, and business intelligence for enterprise clients.",
      imageUrl: "/assets/dashboard.svg",
      icons: [
        { name: "React", icon: "/assets/ReactIcon.svg" },
        { name: "D3.js", icon: "/assets/JavaScriptIcon.svg" },
        { name: "Python", icon: "/assets/NodeIcon.svg" },
        { name: "PostgreSQL", icon: "/assets/MongoIcon.svg" }
      ],
      category: "Analytics",
      status: "Completed",
      link: "#"
    },
    {
      title: "Educational Platform",
      description: "Online learning management system with interactive courses, progress tracking, and collaborative learning features.",
      imageUrl: "/assets/Dbhamz.svg",
      icons: [
        { name: "Vue.js", icon: "/assets/ViteIcon.svg" },
        { name: "Laravel", icon: "/assets/NodeIcon.svg" },
        { name: "MySQL", icon: "/assets/MongoIcon.svg" },
        { name: "WebRTC", icon: "/assets/JavaScriptIcon.svg" }
      ],
      category: "Education",
      status: "In Progress",
      link: "#"
    },
    {
      title: "IoT Monitoring System",
      description: "Industrial IoT solution for real-time monitoring, predictive maintenance, and automated reporting for manufacturing facilities.",
      imageUrl: "/assets/HyperMartx.svg",
      icons: [
        { name: "React", icon: "/assets/ReactIcon.svg" },
        { name: "Node.js", icon: "/assets/NodeIcon.svg" },
        { name: "InfluxDB", icon: "/assets/MongoIcon.svg" },
        { name: "MQTT", icon: "/assets/JavaScriptIcon.svg" }
      ],
      category: "IoT",
      status: "Completed",
      link: "#"
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-indego-dark">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title Section */}
        <div className="text-center mb-16">
          <Title title1="Our" title2="Projects" />
          <motion.p 
            className="text-gray-300 text-lg max-w-3xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore our portfolio of successful projects that showcase our expertise 
            in delivering innovative solutions across various industries.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ProjectCard {...project} />
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
            Have a Project in Mind?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's collaborate to bring your vision to life with our proven expertise 
            and innovative approach to software development.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
