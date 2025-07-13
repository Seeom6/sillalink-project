"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Title from '../components/Title';
import { FiLinkedin, FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

const TeamPage = () => {
  const teamMembers = [
    {
      name: "Ahmed Al-Rashid",
      position: "CEO & Founder",
      image: "/assets/team/ceo.jpg",
      bio: "Visionary leader with 10+ years of experience in software development and business strategy.",
      skills: ["Leadership", "Strategy", "Product Management", "Business Development"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "ahmed@sillalink.com"
      }
    },
    {
      name: "Sarah Johnson",
      position: "CTO & Co-Founder",
      image: "/assets/team/cto.jpg",
      bio: "Technical expert specializing in scalable architecture and emerging technologies.",
      skills: ["System Architecture", "Cloud Computing", "DevOps", "Team Leadership"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "sarah@sillalink.com"
      }
    },
    {
      name: "Mohammad Hassan",
      position: "Lead Frontend Developer",
      image: "/assets/team/frontend-lead.jpg",
      bio: "Frontend specialist with expertise in React, Next.js, and modern web technologies.",
      skills: ["React", "Next.js", "TypeScript", "UI/UX Design"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "mohammad@sillalink.com"
      }
    },
    {
      name: "Emily Chen",
      position: "Lead Backend Developer",
      image: "/assets/team/backend-lead.jpg",
      bio: "Backend expert focused on building robust, scalable server-side applications.",
      skills: ["Node.js", "NestJS", "Database Design", "API Development"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "emily@sillalink.com"
      }
    },
    {
      name: "David Rodriguez",
      position: "Mobile Development Lead",
      image: "/assets/team/mobile-lead.jpg",
      bio: "Mobile development specialist with expertise in React Native and Flutter.",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "david@sillalink.com"
      }
    },
    {
      name: "Fatima Al-Zahra",
      position: "UI/UX Designer",
      image: "/assets/team/designer.jpg",
      bio: "Creative designer passionate about creating intuitive and beautiful user experiences.",
      skills: ["UI Design", "UX Research", "Prototyping", "Design Systems"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "fatima@sillalink.com"
      }
    },
    {
      name: "James Wilson",
      position: "DevOps Engineer",
      image: "/assets/team/devops.jpg",
      bio: "Infrastructure expert specializing in cloud deployment and automation.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "james@sillalink.com"
      }
    },
    {
      name: "Aisha Patel",
      position: "Quality Assurance Lead",
      image: "/assets/team/qa-lead.jpg",
      bio: "QA specialist ensuring the highest quality standards in all our deliverables.",
      skills: ["Test Automation", "Quality Assurance", "Performance Testing", "Bug Tracking"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
        email: "aisha@sillalink.com"
      }
    }
  ];

  const departments = [
    {
      name: "Development",
      count: 12,
      description: "Frontend, Backend, and Mobile developers"
    },
    {
      name: "Design",
      count: 4,
      description: "UI/UX designers and visual artists"
    },
    {
      name: "DevOps",
      count: 3,
      description: "Infrastructure and deployment specialists"
    },
    {
      name: "Quality Assurance",
      count: 5,
      description: "Testing and quality control experts"
    }
  ];

  const values = [
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork and open communication.",
      icon: "🤝"
    },
    {
      title: "Innovation",
      description: "We constantly explore new technologies and creative solutions.",
      icon: "💡"
    },
    {
      title: "Excellence",
      description: "We strive for the highest quality in everything we do.",
      icon: "⭐"
    },
    {
      title: "Growth",
      description: "We invest in our team's professional and personal development.",
      icon: "📈"
    }
  ];

  return (
    <div className="min-h-screen bg-indego-dark">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Title title1="Our" title2="Team" />
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Meet the talented individuals who make Silla Link a leading software development company. 
              Our diverse team brings together expertise, creativity, and passion for innovation.
            </motion.p>
          </div>

          {/* Department Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {departments.map((dept, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {dept.count}+
                </div>
                <div className="text-white font-semibold mb-1">{dept.name}</div>
                <div className="text-gray-400 text-sm">{dept.description}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Meet Our <span className="text-primary">Leadership</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our experienced leadership team guides the company with vision, expertise, and dedication.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Profile Image */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                {/* Name & Position */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium mb-4">{member.position}</p>

                {/* Bio */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{member.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {member.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    <FiLinkedin size={18} />
                  </a>
                  <a
                    href={member.social.github}
                    className="text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    <FiGithub size={18} />
                  </a>
                  <a
                    href={member.social.email}
                    className="text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    <FiMail size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              The core principles that guide our team and shape our company culture.
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

      {/* Join Our Team */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our <span className="text-primary">Team</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for innovation 
              and excellence. Explore career opportunities with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Open Positions
              </motion.a>
              <motion.a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border border-primary text-primary font-semibold rounded-2xl hover:bg-primary hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Your Resume
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
