'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiX, 
  FiEdit, 
  FiTrash2, 
  FiExternalLink, 
  FiStar,
  FiCode,
  FiCalendar,
  FiTrendingUp,
  FiTarget,
  FiBook
} from 'react-icons/fi';
import { Technology } from '@/lib/types/technology';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

// Helper function to validate and format image URLs
const getValidImageUrl = (imageUrl: string | undefined): string | null => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // If it's already a full URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      return null;
    }
  }

  // If it's a relative path, construct the full URL
  if (imageUrl.startsWith('/') || imageUrl.startsWith('media/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
  }

  // For other cases, try to construct a valid URL
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    // If it's not a valid URL, treat it as a relative path
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const serverBaseUrl = baseUrl.replace('/api/v1', '');
    return `${serverBaseUrl}/${imageUrl}`;
  }
};

interface TechnologyModalProps {
  technology: Technology | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (technology: Technology) => void;
  onDelete: (id: string) => void;
}

const InfoSection: React.FC<{
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}> = ({ title, children, icon: Icon }) => (
  <div className="space-y-3">
    <div className="flex items-center space-x-2">
      {Icon && <Icon size={16} className="text-primary-400" />}
      <h4 className="text-sm font-semibold text-primary-300 uppercase tracking-wide">{title}</h4>
    </div>
    <div className="pl-6">{children}</div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'learning': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'expert': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'inactive': return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      case 'deprecated': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-primary-400 bg-primary-400/20 border-primary-400/30';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ProficiencyDisplay: React.FC<{ level: number }> = ({ level }) => {
  const getColor = (level: number) => {
    if (level >= 80) return 'from-green-500 to-green-600';
    if (level >= 60) return 'from-blue-500 to-blue-600';
    if (level >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-primary-300">Proficiency Level</span>
        <span className="text-white font-semibold">{level}%</span>
      </div>
      <div className="w-full bg-dark-700/50 rounded-full h-3">
        <div
          className={`bg-gradient-to-r ${getColor(level)} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
};

export const TechnologyModal: React.FC<TechnologyModalProps> = ({
  technology,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!technology) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <GlassCard className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary-500/20">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const imageUrl = getValidImageUrl(technology.image) || getValidImageUrl(technology.icon);
                    return imageUrl ? (
                      <div className="w-12 h-12 relative">
                        <Image
                          src={imageUrl}
                          alt={technology.name}
                          fill
                          className="object-contain rounded-lg"
                          onError={() => {
                            // Handle image load error silently
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center">
                        <FiCode className="w-6 h-6 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-bold text-white">{technology.name}</h2>
                      {technology.isFeatured && (
                        <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-primary-300">{technology.category.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <EnhancedButton
                    variant="outline"
                    onClick={() => onEdit(technology)}
                    className="border-blue-500/30 text-blue-400 hover:border-blue-500/50"
                  >
                    <FiEdit size={16} />
                    Edit
                  </EnhancedButton>
                  <EnhancedButton
                    variant="outline"
                    onClick={() => onDelete(technology?._id)}
                    className="border-red-500/30 text-red-400 hover:border-red-500/50"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </EnhancedButton>
                  <button
                    onClick={onClose}
                    className="p-2 text-primary-300 hover:text-white hover:bg-primary-500/20 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Description */}
                    <InfoSection title="Description" icon={FiBook}>
                      <p className="text-primary-200 leading-relaxed">
                        {technology.description}
                      </p>
                      {technology.longDescription && (
                        <p className="text-primary-300 mt-3 leading-relaxed">
                          {technology.longDescription}
                        </p>
                      )}
                    </InfoSection>

                    {/* Status & Category */}
                    <InfoSection title="Status & Category">
                      <div className="flex items-center space-x-3">
                        <StatusBadge status={technology.status} />
                        <span className="px-3 py-1 bg-dark-700/50 text-primary-300 rounded-full text-sm">
                          {technology.category.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 bg-dark-700/50 text-primary-300 rounded-full text-sm">
                          {technology.difficultyLevel}
                        </span>
                      </div>
                    </InfoSection>

                    {/* Proficiency */}
                    <InfoSection title="Proficiency" icon={FiTrendingUp}>
                      <ProficiencyDisplay level={technology.proficiencyLevel} />
                    </InfoSection>

                    {/* Tags */}
                    {technology.tags && technology.tags.length > 0 && (
                      <InfoSection title="Tags">
                        <div className="flex flex-wrap gap-2">
                          {technology.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-500/10 text-primary-400 text-sm rounded-full border border-primary-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </InfoSection>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Statistics */}
                    <InfoSection title="Statistics" icon={FiTarget}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-dark-800/30 rounded-lg">
                          <div className="text-2xl font-bold text-white">{technology.projectsUsedIn}</div>
                          <div className="text-sm text-primary-300">Projects Used</div>
                        </div>
                        <div className="text-center p-4 bg-dark-800/30 rounded-lg">
                          <div className="text-2xl font-bold text-white">{technology.estimatedLearningHours || 0}</div>
                          <div className="text-sm text-primary-300">Learning Hours</div>
                        </div>
                      </div>
                    </InfoSection>

                    {/* Links */}
                    <InfoSection title="Links" icon={FiExternalLink}>
                      <div className="space-y-2">
                        {technology.officialWebsite && (
                          <a
                            href={technology.officialWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FiExternalLink size={16} />
                            <span>Official Website</span>
                          </a>
                        )}
                        {technology.documentation && (
                          <a
                            href={technology.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <FiBook size={16} />
                            <span>Documentation</span>
                          </a>
                        )}
                      </div>
                    </InfoSection>

                    {/* Prerequisites */}
                    {technology.prerequisites && technology.prerequisites.length > 0 && (
                      <InfoSection title="Prerequisites">
                        <ul className="space-y-1">
                          {technology.prerequisites.map((prereq, index) => (
                            <li key={index} className="text-primary-300 text-sm">
                              • {prereq}
                            </li>
                          ))}
                        </ul>
                      </InfoSection>
                    )}

                    {/* Learning Resources */}
                    {technology.learningResources && technology.learningResources.length > 0 && (
                      <InfoSection title="Learning Resources">
                        <ul className="space-y-1">
                          {technology.learningResources.map((resource, index) => (
                            <li key={index} className="text-primary-300 text-sm">
                              • {resource}
                            </li>
                          ))}
                        </ul>
                      </InfoSection>
                    )}

                    {/* Metadata */}
                    <InfoSection title="Metadata" icon={FiCalendar}>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-primary-300">Created:</span>
                          <span className="text-white">{new Date(technology.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary-300">Updated:</span>
                          <span className="text-white">{new Date(technology.updatedAt).toLocaleDateString()}</span>
                        </div>
                        {technology.version && (
                          <div className="flex justify-between">
                            <span className="text-primary-300">Version:</span>
                            <span className="text-white">{technology.version}</span>
                          </div>
                        )}
                        {technology.lastUsed && (
                          <div className="flex justify-between">
                            <span className="text-primary-300">Last Used:</span>
                            <span className="text-white">{new Date(technology.lastUsed).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </InfoSection>

                    {/* Notes */}
                    {technology.notes && (
                      <InfoSection title="Notes">
                        <p className="text-primary-300 text-sm leading-relaxed">
                          {technology.notes}
                        </p>
                      </InfoSection>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
