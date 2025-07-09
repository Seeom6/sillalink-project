import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaWhatsapp, FaInstagram, FaFacebook, FaGithub, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const EmailBoard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const [focusedFields, setFocusedFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    message: false
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field: keyof typeof focusedFields) => {
    setFocusedFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleBlur = (field: keyof typeof focusedFields) => {
    if (!formData[field]) {
      setFocusedFields(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const socialLinks = [
    { icon: <FaLinkedin className="text-2xl" />, url: "https://linkedin.com" },
    { icon: <FaWhatsapp className="text-2xl" />, url: "https://whatsapp.com" },
    { icon: <FaInstagram className="text-2xl" />, url: "https://instagram.com" },
    { icon: <FaFacebook className="text-2xl" />, url: "https://facebook.com" },
    { icon: <FaGithub className="text-2xl" />, url: "https://github.com" },
    { icon: <FaEnvelope className="text-2xl" />, url: "mailto:contact@example.com" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!isMounted) {
    // Return a simple loader or null during SSR
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indego-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        className="w-full relative max-w-6xl rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row z-20 relative shadow-glass">
          {/* Form Section */}
          <motion.div
            className="w-full md:w-1/2 z-20 p-2 md:p-8 sm:p-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-medium md:text-large font-bold text-gray-100"
              variants={itemVariants}
            >
              Let's connect constellations
            </motion.h2>
            <motion.p
              className="text-gray-300 text-small md:text-regular mb-8"
              variants={itemVariants}
            >
              We are here to answer all your inquiries and help you choose the right
              software solutions for your needs.
            </motion.p>

            <form onSubmit={handleSubmit}>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                variants={itemVariants}
              >
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => handleFocus("firstName")}
                    onBlur={() => handleBlur("firstName")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 peer"
                    required
                  />
                  <label
                    htmlFor="firstName"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedFields.firstName || formData.firstName
                        ? "top-1 text-xs text-purple-300"
                        : "top-3.5 text-gray-400"
                    }`}
                  >
                    First Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => handleFocus("lastName")}
                    onBlur={() => handleBlur("lastName")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 peer"
                    required
                  />
                  <label
                    htmlFor="lastName"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedFields.lastName || formData.lastName
                        ? "top-1 text-xs text-purple-300"
                        : "top-3.5 text-gray-400"
                    }`}
                  >
                    Last Name
                  </label>
                </div>
              </motion.div>

              <motion.div className="mb-6" variants={itemVariants}>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 peer"
                    required
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedFields.email || formData.email
                        ? "top-1 text-xs text-purple-300"
                        : "top-3.5 text-gray-400"
                    }`}
                  >
                    Email
                  </label>
                </div>
              </motion.div>

              <motion.div className="mb-6" variants={itemVariants}>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus("phone")}
                    onBlur={() => handleBlur("phone")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 peer"
                  />
                  <label
                    htmlFor="phone"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedFields.phone || formData.phone
                        ? "top-1 text-xs text-purple-300"
                        : "top-3.5 text-gray-400"
                    }`}
                  >
                    Phone Number
                  </label>
                </div>
              </motion.div>

              <motion.div className="mb-8" variants={itemVariants}>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus("message")}
                    onBlur={() => handleBlur("message")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 peer pt-5"
                    required
                  />
                  <label
                    htmlFor="message"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedFields.message || formData.message
                        ? "top-1 text-xs text-purple-300"
                        : "top-3.5 text-gray-400"
                    }`}
                  >
                    Message
                  </label>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  Send Message <FiSend />
                </button>
              </motion.div>
            </form>

            {/* Social Icons */}
            <motion.div
              className="mt-8 flex justify-center space-x-6"
              variants={itemVariants}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center z-20 border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-6">
              <FaMapMarkerAlt className="text-4xl text-purple-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white">Our Location</h3>
              <p className="text-gray-300 mt-1">123 Constellation St, Tech City</p>
            </div>
            
            <motion.div
              className="w-full h-64 md:h-full bg-purple-900/20 rounded-xl overflow-hidden relative border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-purple-300 font-medium">Map would be displayed here</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailBoard;