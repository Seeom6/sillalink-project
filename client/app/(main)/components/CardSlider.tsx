'use client';

import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import "../../../public/assets/about2.png"
interface CardSliderProps<T> {
  cards: T[];
  renderCard: (card: T) => ReactNode;
  className?: string;
  cardClassName?: string;
}

export function CardSlider<T>({
  cards,
  renderCard,
  className = '',
  cardClassName = '',
}: CardSliderProps<T>) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // const scroll = (direction: 'left' | 'right') => {
  //   if (sliderRef.current) {
  //     const cardElement = sliderRef.current.querySelector('.card-slider-item');
  //     if (cardElement) {
  //       const scrollAmount = cardElement.clientWidth + 24; // 24px for gap
  //       sliderRef.current.scrollBy({
  //         left: direction === 'left' ? -scrollAmount : scrollAmount,
  //         behavior: 'smooth',
  //       });
  //     }
  //   }
  // };

  return (
    <div className={`relative  group ${className}`}>
      {/* Navigation Arrows */}
      {/* <motion.button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hiddenScrollbar backdrop-blur-sm transition-all -ml-2"
        aria-label="Scroll left"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeftIcon />
      </motion.button> */}

      {/* Cards Container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-2 md:gap-6 py-6 scroll-snap-x-mandatory hiddenScrollbar"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`flex-shrink-0 w-[300px] sm:w-[350px] card-slider-item scroll-snap-align-start ${cardClassName}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {renderCard(card)}
          </motion.div>
        ))}
      </div>

      {/* <motion.button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all -mr-2"
        aria-label="Scroll right"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
      </motion.button> */}
    </div>
  );
}

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-700"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-700"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);