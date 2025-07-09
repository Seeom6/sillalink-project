"use client";

import { icons } from "@/app/shared/data/icons";
import Button from "@/app/shared/ui/button";
import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";
import { Spotlight } from "../ui/Spotlight";
import CodeAnimation from "./Code.Animation";
import { TiArrowForward } from "react-icons/ti";

const HeroSection = () => {
  return (
    <div id="home" className="w-full flex flex-col justify-center items-center mb-26">
      <div className="w-full flex flex-col justify-between lg:h-screen items-center max-w-[1260px] p-3 relative overflow-hidden md:flex-row">
        <Spotlight
          className="top-0 left-1/2 -translate-x-1/2 h-[66vh] w-[50wh]"
          fill="white"
        />
        <Spotlight
          className="top-[34rem] left-[80rem]  h-[66vh] w-[50wh]"
          fill="#6B2C91"
        />
        <Spotlight
          className="top-[27rem] left-[10rem]  h-[66vh] w-[50wh]"
          fill="#FFCEF4"
        />

        <div className="w-full flex flex-col justify-center z-10 text-center lg:text-start">
          <h2 className="text-sm text-gray-100">Start your digital journey with us now!</h2>
          <p className="text-medium  font-extrabold text-gray-100 mt-4">
            <span className="text-primary">Sillalink –</span> Where Ideas Become
            Digital Reality!
          </p>
          <p className="text-gray-100 mt-4">
            In <span className="text-primary">Sillalink </span>, we help
            businesses transition into the digital future with innovative,
            customized software solutions that meet your unique needs.We provide
            you with cutting-edge technologies to ensure success and growth in
            the fast-changing world of business.
          </p>
          <div className="mt-6 flex gap-4 justify-center lg:justify-start items-start lg:items-center">
            <Button className="bg-primary rounded-2xl h-12">
              See our work
              <span className='ml-2'><TiArrowForward /></span>
            </Button>
            <Button variant="secondary" className="bg-primary rounded-2xl h-12">
              Let's Talk
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-center z-10">
          <CodeAnimation />
        </div>
      </div>
      <div className=" w-full shadow-white bg-[rgba(28,27,51,0.2)]backdrop-blur-lg lg:rounded-4xl overflow-hidden relative before:content-[''] before:absolute before:inset-0 before: before:opacity-50 before:pointer-events-none  max-w-[1260px] flex justify-center items-center">
        <InfiniteMovingCards items={icons} speed="normal" />
      </div>
    </div>
  );
};

export default HeroSection;
