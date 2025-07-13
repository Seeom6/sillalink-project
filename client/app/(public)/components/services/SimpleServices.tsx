"use client";

import React from 'react';

const SimpleServices = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-indego-dark">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            We offer comprehensive software development services to help your business 
            thrive in the digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">Web Development</h3>
            <p className="text-gray-300">Custom web applications built with modern technologies.</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">Mobile Development</h3>
            <p className="text-gray-300">Native and cross-platform mobile applications.</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">Cloud Solutions</h3>
            <p className="text-gray-300">Scalable cloud infrastructure and deployment solutions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleServices;
