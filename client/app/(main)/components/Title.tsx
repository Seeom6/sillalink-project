"use client";
import { motion } from "framer-motion";

const Title = ({ title1, title2 }: { title1: string; title2: string }) => {
  // Animation variants
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.01 }
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="w-full h-12  text-white flex justify-center items-center relative my-5">
      <motion.p 
        className="font-inspiration! text-6xl flex justify-center items-center relative z-10 w-[500px] h-[100px] tracking-widest"
      >
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={textVariants}
        >
          {title1}
          <span className="text-primary ml-1">{title2}</span>
        </motion.span>

        <span className="flex absolute z-[-1] place-content-center w-3/5 md:w-full h-2/5 md:h-[50%] rounded-full blur-2xl bg-purple opacity-45"></span>

        <motion.svg
          width="174"
          height="65"
          viewBox="0 0 194 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-1/2 h-1/2 md:w-full md:h-full opacity-35"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.path
            d="M115.298 63.1C227.706 108.485 230.494 72.5579 46.5189 25.025C-111.823 -15.8853 196.171 3.02331 164.478 22.816"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            variants={pathVariants}
          />
        </motion.svg>
      </motion.p>
    </div>
  );
};

export default Title;