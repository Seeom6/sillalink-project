"use client"
import React from 'react';
import Lottie from 'lottie-react';
import HeroAnimation from '../../../../public/animations/heroAnime.json';
import LottieAnimation from '../LottieAnimation';

const CodeAnimation = () => {
  return (
    <div  className='flex w-[250px] md:w-[400px] lg:w-[500px] h-[300px]'>
     <LottieAnimation animationData={HeroAnimation} />
    </div>
  );
};

export default CodeAnimation;