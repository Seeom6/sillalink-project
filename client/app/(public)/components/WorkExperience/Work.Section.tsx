import WorkCard from "./WorkCards";
import React from 'react';
import { 
  FiGlobe, 
  FiCloud, 
  FiCpu, 
  FiDatabase, 
  FiCheckCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Title from '../Title';
import Image from 'next/image';
// import workImage from '@/public/assets/Teamgoals.svg';
import { CardSlider } from './../CardSlider';

const WorkExperience = () => {
  const techCards = [
    {
      icon: <FiGlobe size={24} className="text-indigo-400" />,
      title: 'Web Development',
      description: 'Modern web applications with cutting-edge technologies',
    },
    {
      icon: <FiCloud size={24} className="text-indigo-400" />,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure for your business needs',
    },
    {
      icon: <FiCpu size={24} className="text-indigo-400" />,
      title: 'AI Integration',
      description: 'Smart solutions powered by artificial intelligence',
    },
    {
      icon: <FiDatabase size={24} className="text-indigo-400" />,
      title: 'Big Data',
      description: 'Harness the power of your data with our analytics',
    },
    // Add more cards as needed
    {
      icon: <FiCheckCircle size={24} className="text-indigo-400" />,
      title: 'DevOps',
      description: 'Continuous integration and deployment pipelines',
    },
    {
      icon: <FiCpu size={24} className="text-indigo-400" />,
      title: 'IoT Solutions',
      description: 'Connected devices and smart systems',
    },
    {
      icon: <FiGlobe size={24} className="text-indigo-400" />,
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications',
    },
  ];

  const methodologyPoints = [
    { icon: <FiCheckCircle className="text-indigo-400" />, text: 'Innovative methodology' },
    { icon: <FiCheckCircle className="text-indigo-400" />, text: 'Accurate data analysis' },
    { icon: <FiCheckCircle className="text-indigo-400" />, text: 'Artificial Intelligence and Machine Learning' },
    { icon: <FiCheckCircle className="text-indigo-400" />, text: 'Customized solutions' },
  ];

  return (
    <main id='experience' className="py-20 px-4 sm:px-6 lg:px-8 bg-indego-dark">
      <div className="mx-auto max-w-7xl">
        {/* Title Section */}
        <div className="text-center mb-16">
          <Title title1='Exper' title2='ience' />
        </div>

        {/* Methodology and Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-medium md:text-large font-bold text-white">
              The <span className='text-primary'>techniques</span> we use to make our <span className='text-primary'>projects successful</span>
            </h3>
            <ul className="space-y-4">
              {methodologyPoints.map((point, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="mt-1 mr-3">{point.icon}</span>
                  <span className="text-indigo-100">{point.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-80 lg:h-96 rounded-xl overflow-hidden border"
          >
            <Image
              src="/assets/Teamgoals.svg"
              alt="Our work process"
              fill
              className="object-cover"
              quality={100}
            />
          </motion.div>
        </div>

        {/* Work Cards Section - Now using CardSlider */}
        <CardSlider
          cards={techCards}
          renderCard={(card) => (
            <WorkCard 
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          )}
          className="mt-8"
          cardClassName="h-full"
        />

        {/* Fallback grid layout for smaller screens if needed */}
        
      </div>
    </main>
  );
};

export default WorkExperience;