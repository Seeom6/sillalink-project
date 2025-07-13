"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import ProjectCard from '../components/projects/Project.Card';
import { FiFilter } from 'react-icons/fi';

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Web Application', 'Mobile App', 'E-commerce', 'Healthcare', 'Analytics', 'IoT'];

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A comprehensive e-commerce solution with advanced features including inventory management, payment processing, analytics dashboard, and multi-vendor support.",
      imageUrl: "/assets/scentora.svg",
      icons: [
        { name: "React", icon: "/assets/ReactIcon.svg" },
        { name: "Node.js", icon: "/assets/NodeIcon.svg" },
        { name: "MongoDB", icon: "/assets/MongoIcon.svg" },
        { name: "TypeScript", icon: "/assets/TypeScriptIcon.svg" }
      ],
      category: "E-commerce",
      status: "Completed",
      link: "#",
      client: "Retail Corp",
      duration: "6 months",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"]
    },
    {
      title: "Healthcare Management System",
      description: "Digital transformation solution for healthcare providers with patient management, appointment scheduling, telemedicine capabilities, and electronic health records.",
      imageUrl: "/assets/mechanic.svg",
      icons: [
        { name: "Next.js", icon: "/assets/NextIcon.svg" },
        { name: "NestJS", icon: "/assets/nestjs.svg" },
        { name: "PostgreSQL", icon: "/assets/MongoIcon.svg" },
        { name: "TypeScript", icon: "/assets/TypeScriptIcon.svg" }
      ],
      category: "Healthcare",
      status: "In Progress",
      link: "#",
      client: "MedTech Solutions",
      duration: "8 months",
      technologies: ["Next.js", "NestJS", "PostgreSQL", "WebRTC", "Docker"]
    },
    {
      title: "Food Delivery App",
      description: "Mobile-first food delivery platform with real-time tracking, payment integration, restaurant management system, and customer loyalty programs.",
      imageUrl: "/assets/sillaFood.svg",
      icons: [
        { name: "React Native", icon: "/assets/ReactIcon.svg" },
        { name: "Node.js", icon: "/assets/NodeIcon.svg" },
        { name: "MongoDB", icon: "/assets/MongoIcon.svg" },
        { name: "Flutter", icon: "/assets/FlutterIcon.svg" }
      ],
      category: "Mobile App",
      status: "Completed",
      link: "#",
      client: "FoodieExpress",
      duration: "4 months",
      technologies: ["React Native", "Node.js", "MongoDB", "Socket.io", "Firebase"]
    },
    {
      title: "Business Analytics Dashboard",
      description: "Comprehensive analytics platform providing real-time insights, data visualization, business intelligence, and predictive analytics for enterprise clients.",
      imageUrl: "/assets/dashboard.svg",
      icons: [
        { name: "React", icon: "/assets/ReactIcon.svg" },
        { name: "D3.js", icon: "/assets/JavaScriptIcon.svg" },
        { name: "Python", icon: "/assets/NodeIcon.svg" },
        { name: "PostgreSQL", icon: "/assets/MongoIcon.svg" }
      ],
      category: "Analytics",
      status: "Completed",
      link: "#",
      client: "DataCorp Inc",
      duration: "5 months",
      technologies: ["React", "D3.js", "Python", "PostgreSQL", "Redis"]
    },
    {
      title: "Educational Platform",
      description: "Online learning management system with interactive courses, progress tracking, collaborative learning features, and virtual classroom capabilities.",
      imageUrl: "/assets/Dbhamz.svg",
      icons: [
        { name: "Vue.js", icon: "/assets/ViteIcon.svg" },
        { name: "Laravel", icon: "/assets/NodeIcon.svg" },
        { name: "MySQL", icon: "/assets/MongoIcon.svg" },
        { name: "WebRTC", icon: "/assets/JavaScriptIcon.svg" }
      ],
      category: "Web Application",
      status: "In Progress",
      link: "#",
      client: "EduTech Academy",
      duration: "7 months",
      technologies: ["Vue.js", "Laravel", "MySQL", "WebRTC", "Elasticsearch"]
    },
    {
      title: "IoT Monitoring System",
      description: "Industrial IoT solution for real-time monitoring, predictive maintenance, automated reporting, and equipment optimization for manufacturing facilities.",
      imageUrl: "/assets/HyperMartx.svg",
      icons: [
        { name: "React", icon: "/assets/ReactIcon.svg" },
        { name: "Node.js", icon: "/assets/NodeIcon.svg" },
        { name: "InfluxDB", icon: "/assets/MongoIcon.svg" },
        { name: "MQTT", icon: "/assets/JavaScriptIcon.svg" }
      ],
      category: "IoT",
      status: "Completed",
      link: "#",
      client: "Industrial Systems Ltd",
      duration: "9 months",
      technologies: ["React", "Node.js", "InfluxDB", "MQTT", "Grafana"]
    },
    {
      title: "Financial Trading Platform",
      description: "High-performance trading platform with real-time market data, advanced charting, portfolio management, and algorithmic trading capabilities.",
      imageUrl: "/assets/about1.png",
      icons: [
        { name: "React", icon: "/assets/ReactIcon.svg" },
        { name: "Node.js", icon: "/assets/NodeIcon.svg" },
        { name: "Redis", icon: "/assets/MongoIcon.svg" },
        { name: "WebSocket", icon: "/assets/JavaScriptIcon.svg" }
      ],
      category: "Web Application",
      status: "Completed",
      link: "#",
      client: "FinTech Pro",
      duration: "10 months",
      technologies: ["React", "Node.js", "Redis", "WebSocket", "Kubernetes"]
    },
    {
      title: "Social Media Management Tool",
      description: "Comprehensive social media management platform with content scheduling, analytics, team collaboration, and multi-platform integration.",
      imageUrl: "/assets/about2.png",
      icons: [
        { name: "Next.js", icon: "/assets/NextIcon.svg" },
        { name: "NestJS", icon: "/assets/nestjs.svg" },
        { name: "MongoDB", icon: "/assets/MongoIcon.svg" },
        { name: "TypeScript", icon: "/assets/TypeScriptIcon.svg" }
      ],
      category: "Web Application",
      status: "In Progress",
      link: "#",
      client: "SocialBoost",
      duration: "6 months",
      technologies: ["Next.js", "NestJS", "MongoDB", "Bull Queue", "AWS S3"]
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <div className="min-h-screen bg-indego-dark">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Title title1="Our" title2="Projects" />
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore our portfolio of successful projects that showcase our expertise 
              in delivering innovative solutions across various industries.
            </motion.p>
          </div>

          {/* Filter Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <FiFilter className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No projects found</h3>
              <p className="text-gray-500">Try selecting a different filter category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-300">Projects Completed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-gray-300">Happy Clients</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-300">Industries Served</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-300">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Have a Project <span className="text-primary">in Mind?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Let's collaborate to bring your vision to life with our proven expertise 
              and innovative approach to software development.
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Project
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
