import React from "react";
import { LuSparkles } from "react-icons/lu";
import { FaStar, FaEye, FaGlobe } from "react-icons/fa6";

export const NUMBERED_SECTIONS = [
  "We are a software company that believes every great idea deserves to come to life. We turn creativity into smart systems built for the future.",
  "We build high-quality software solutions that help you grow and evolve. With our expertise, we create tools that move you forward.",
  "Behind every line of code we write, there's a person we aim to serve."
];

export const FEATURES = [
  {
    icon: React.createElement(LuSparkles, { className: "h-5 w-5 md:h-6 md:w-6 text-purple-500" }),
    text: "The beginning of the idea."
  },
  {
    icon: React.createElement(FaStar, { className: "h-5 w-5 md:h-6 md:w-6 text-purple-500" }),
    text: "Excellence in every detail."
  },
  {
    icon: React.createElement(FaEye, { className: "h-5 w-5 md:h-6 md:w-6 text-purple-500" }),
    text: "We see what others do not see."
  },
  {
    icon: React.createElement(FaGlobe, { className: "h-5 w-5 md:h-6 md:w-6 text-purple-500" }),
    text: "We make an impact that transcends borders."
  }
];
