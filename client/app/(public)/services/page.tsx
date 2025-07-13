"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import ServiceCard from '../components/services/Service.Card';
import { 
  FiCode, 
  FiSmartphone, 
  FiCloud, 
  FiDatabase, 
  FiShield, 
  FiTrendingUp,
  FiMonitor,
  FiSettings,
  FiGlobe,
  FiCpu
} from 'react-icons/fi';

const ServicesPage = () => {
  const mainServices = [
    {
      icon: <FiCode size={32} className="text-primary" />,
      title: "Web Development",
      description: "Custom web applications built with modern technologies like React, Next.js, and Node.js for optimal performance and user experience.",
      features: ["Responsive Design", "SEO Optimization", "Performance Tuning", "Modern Frameworks"],
      technologies: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "Express"],
      pricing: "Starting from $5,000"
    },
    {
      icon: <FiSmartphone size={32} className="text-primary" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter technologies.",
      features: ["Cross-Platform", "Native Performance", "App Store Deployment", "Push Notifications"],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
      pricing: "Starting from $8,000"
    },
    {
      icon: <FiCloud size={32} className="text-primary" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment solutions using AWS, Azure, and Google Cloud platforms.",
      features: ["Auto Scaling", "Load Balancing", "CI/CD Pipelines", "Monitoring & Analytics"],
      technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
      pricing: "Starting from $3,000"
    },
    {
      icon: <FiDatabase size={32} className="text-primary" />,
      title: "Backend Development",
      description: "Robust backend systems and APIs using NestJS, Express, and microservices architecture for enterprise applications.",
      features: ["RESTful APIs", "Microservices", "Database Design", "Real-time Features"],
      technologies: ["NestJS", "Express", "FastAPI", "GraphQL", "MongoDB", "PostgreSQL"],
      pricing: "Starting from $4,000"
    },
    {
      icon: <FiShield size={32} className="text-primary" />,
      title: "Security & Authentication",
      description: "Comprehensive security solutions including authentication, authorization, and data protection for your applications.",
      features: ["JWT Authentication", "Role-based Access", "Data Encryption", "Security Audits"],
      technologies: ["OAuth", "JWT", "SSL/TLS", "Encryption", "Firewall"],
      pricing: "Starting from $2,500"
    },
    {
      icon: <FiTrendingUp size={32} className="text-primary" />,
      title: "Digital Transformation",
      description: "Complete digital transformation services to modernize your business processes and improve operational efficiency.",
      features: ["Process Automation", "Legacy Migration", "Digital Strategy", "Technology Consulting"],
      technologies: ["RPA", "AI/ML", "IoT", "Blockchain", "Analytics"],
      pricing: "Custom Quote"
    }
  ];

  const additionalServices = [
    {
      icon: <FiMonitor size={24} className="text-primary" />,
      title: "UI/UX Design",
      description: "User-centered design solutions that create engaging and intuitive digital experiences."
    },
    {
      icon: <FiSettings size={24} className="text-primary" />,
      title: "DevOps & Automation",
      description: "Streamlined development workflows with automated testing, deployment, and monitoring."
    },
    {
      icon: <FiGlobe size={24} className="text-primary" />,
      title: "E-commerce Solutions",
      description: "Complete e-commerce platforms with payment integration and inventory management."
    },
    {
      icon: <FiCpu size={24} className="text-primary" />,
      title: "AI & Machine Learning",
      description: "Intelligent solutions powered by artificial intelligence and machine learning algorithms."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We analyze your requirements, understand your business goals, and create a detailed project roadmap."
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "Our design team creates wireframes, mockups, and interactive prototypes for your approval."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "We build your solution using agile methodology with continuous testing and quality assurance."
    },
    {
      step: "04",
      title: "Deployment & Support",
      description: "We deploy your solution and provide ongoing maintenance and support to ensure optimal performance."
    }
  ];

  return (
    <div className="min-h-screen bg-indego-dark">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Title title1="Our" title2="Services" />
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We offer comprehensive software development services to help your business 
              thrive in the digital world. From web applications to mobile apps and cloud solutions.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {mainServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ServiceCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Additional <span className="text-primary">Expertise</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Beyond our core services, we offer specialized solutions to meet your unique business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our <span className="text-primary">Process</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We follow a proven methodology to ensure successful project delivery and client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Connection Line */}
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary/30 z-0"></div>
                )}
                
                <div className="relative z-10 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-primary">Project?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss your requirements and create a custom solution that drives your business forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Free Consultation
              </motion.a>
              <motion.a
                href="/projects"
                className="inline-flex items-center px-8 py-4 border border-primary text-primary font-semibold rounded-2xl hover:bg-primary hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Our Work
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
