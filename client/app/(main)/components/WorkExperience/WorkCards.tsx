import { motion } from 'framer-motion';
interface WorkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WorkCard: React.FC<WorkCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-indigo-900/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full min-h-[200px] flex flex-col border border-indigo-800 p-6"
      whileHover={{ y: -5 }}
    >
      <div className="mb-4 p-3 bg-indigo-900/50 rounded-lg w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-indigo-200 flex-grow">{description}</p>
    </motion.div>
  );
};

export default WorkCard