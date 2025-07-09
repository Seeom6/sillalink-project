// components/ExampleCard.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  children?: ReactNode;
  icons?: string[];
}
function ProjectCard({
  title,
  description,
  imageUrl,
  icons,
}: ProjectCardProps) {
  return (
    <motion.div
      className="bg-indego-dark rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-purple md:p-3 pb-3"
      whileHover={{ y: -5 }}
    >
      {imageUrl && (
        <div className="h-56 overflow-hidden p-3 relative">
          <Image
            src={imageUrl}
            alt="Team member"
            className=" h-full rounded-2xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-semibold text-gray-100 mb-3 uppercase">{title}</h3>
        <p className="text-gray-100 mb-6 text-small">{description}</p>
      </div>
      <div className="w-full flex flex-wrap gap-4 p-3 justify-between items-center">
        <div className="flex justify-center items-center">
          {icons?.map((icon: string, idx) => (
            <Image
              key={idx}
              src={icon}
              alt={`Technology icon ${idx + 1}`}
              width={36}
              height={36}
              className="p-1 shadow-icon mx-[-1px] rounded-full w-6 md:w-9"
            />
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href={''} className="w-full rounded-lg text-extraSmall  bg-indego-dark border border-purple px-2 py-3 text-purple hover:bg-purple hover:text-white">

            Check Live Site
          </Link>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
