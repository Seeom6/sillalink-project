"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Title from '../components/Title';
import { FiUsers, FiTarget, FiAward, FiTrendingUp } from 'react-icons/fi';

const AboutPage = () => {
  const stats = [
    { icon: <FiUsers size={32} />, number: "50+", label: "Projects Completed" },
    { icon: <FiTarget size={32} />, number: "25+", label: "Happy Clients" },
    { icon: <FiAward size={32} />, number: "5+", label: "Years Experience" },
    { icon: <FiTrendingUp size={32} />, number: "100%", label: "Success Rate" }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative solutions to deliver exceptional results.",
      icon: "💡"
    },
    {
      title: "Quality",
      description: "Every project is crafted with meticulous attention to detail and highest quality standards.",
      icon: "⭐"
    },
    {
      title: "Collaboration",
      description: "We work closely with our clients as partners to achieve their business objectives.",
      icon: "🤝"
    },
    {
      title: "Reliability",
      description: "Our clients trust us to deliver on time, within budget, and exceed expectations.",
      icon: "🛡️"
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "Company Founded",
      description: "Started with a vision to transform businesses through innovative software solutions."
    },
    {
      year: "2020",
      title: "First Major Project",
      description: "Successfully delivered our first enterprise-level e-commerce platform."
    },
    {
      year: "2021",
      title: "Team Expansion",
      description: "Grew our team to include specialists in mobile development and cloud solutions."
    },
    {
      year: "2022",
      title: "International Clients",
      description: "Expanded our reach to serve clients across multiple countries and industries."
    },
    {
      year: "2023",
      title: "AI Integration",
      description: "Pioneered AI-powered solutions and machine learning implementations."
    },
    {
      year: "2024",
      title: "Industry Recognition",
      description: "Recognized as a leading software development company in the region."
    }
  ];

  return (
    <div className="min-h-screen bg-indego-dark">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Title title1="About" title2="Silla Link" />
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We are a passionate team of developers, designers, and innovators dedicated to 
              transforming businesses through cutting-edge software solutions.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-primary mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our <span className="text-primary">Mission</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                To empower businesses with innovative software solutions that drive growth, 
                efficiency, and digital transformation. We believe in creating technology 
                that not only meets current needs but anticipates future challenges.
              </p>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our <span className="text-primary">Vision</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                To be the leading software development partner for businesses worldwide, 
                recognized for our innovation, quality, and commitment to client success.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="/assets/aboutSectionImage.png"
                alt="Our Mission and Vision"
                width={600}
                height={400}
                className="rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-gray-300 text-lg">
              From humble beginnings to industry recognition - our story of growth and innovation.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-primary/30"></div>

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-indego-dark"></div>

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <div className="text-primary font-bold text-lg mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              Ready to Work <span className="text-primary">Together?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business with innovative software solutions.
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
