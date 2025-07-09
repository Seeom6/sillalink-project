"use client"
import Image from 'next/image';
import AboutSection from './components/about/About.Section';
import HeroSection from './components/home/Home.Section';
import { ServicesSection } from '@/app/shared/components/sections/ServicesSection';
import { ProjectsSection } from '@/app/shared/components/sections/ProjectsSection';
// import layer from "../../public/assets/layer1.svg"
// import layer2 from "../../public/assets/layer2.svg"
import WorkExperience from './components/WorkExperience/Work.Section';
import ContactSection from './components/contact/Contact.Section';


export default function HomePage() {
  return (
    <div className='w-full relative overflow-hidden bg-indego-dark'>
      <HeroSection />
      <AboutSection />
      <ServicesSection variant="main" />

      {/* Fixed: Added relative container for the first image */}
      <div className="relative">
        <Image
          src="/assets/layer1.svg"
          width={240}
          height={240}
          className='w-60 absolute hidden md:block left-[-100px] opacity-50'
          alt='layer'
        />
      </div>

      <ProjectsSection variant="main" />
      <WorkExperience/>
      
      {/* Fixed: Added relative container for the second image */}
      <div className="relative">
        <Image
          src="/assets/layer2.svg"
          width={240}
          height={240}
          className='w-60 absolute hidden md:block right-[-100px] opacity-50'
          alt='layer'
        />
      </div>
      
      <ContactSection/>
    </div>
  )
}