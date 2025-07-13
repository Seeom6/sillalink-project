// Enhanced Animation Variants for Silla Link Portfolio
import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    }
  },
  exit: {
    opacity: 0,
    y: -60,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    }
  }
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -60,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    }
  }
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 60,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    }
  }
};

export const scaleIn = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -5
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // Bounce easing
    }
  }
};

export const slideInFromBottom = {
  initial: { 
    opacity: 0, 
    y: 100,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  }
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  }
};

export const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
};

export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(121, 22, 255, 0.3)",
      "0 0 40px rgba(121, 22, 255, 0.5)",
      "0 0 20px rgba(121, 22, 255, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
};

export const rotateIn = {
  initial: { 
    opacity: 0, 
    rotate: -180,
    scale: 0.5
  },
  animate: { 
    opacity: 1, 
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1],
    }
  }
};

export const slideInFromTop = {
  initial: { 
    opacity: 0, 
    y: -100,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  }
};

export const morphIn = {
  initial: { 
    opacity: 0, 
    scale: 0,
    borderRadius: "50%"
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    borderRadius: "1rem",
    transition: {
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1],
    }
  }
};

export const typewriter = {
  initial: { width: 0 },
  animate: { 
    width: "100%",
    transition: {
      duration: 2,
      ease: "easeInOut",
    }
  }
};

export const gradientShift = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
};

// Hover animations
export const hoverLift = {
  whileHover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    }
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    }
  }
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 30px rgba(121, 22, 255, 0.4)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    }
  }
};

export const hoverRotate = {
  whileHover: {
    rotate: 5,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    }
  }
};

// Page transition variants
export const pageTransition = {
  initial: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.05,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.55, 0.06, 0.68, 0.19],
    }
  }
};

// Scroll-triggered animations
export const scrollReveal = {
  initial: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  whileInView: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  viewport: { 
    once: true, 
    amount: 0.3 
  }
};
