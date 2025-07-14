'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiCode, 
  FiStar, 
  FiExternalLink, 
  FiFilter,
  FiSearch,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { 
  usePublicFeaturedTechnologies, 
  usePublicTechnologies,
  usePublicTechnologyCategories 
} from '@/lib/hooks/use-public-technologies';
import { Technology, TechnologyCategory } from '@/lib/types/technology';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface TechnologyShowcaseProps {
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  categories?: TechnologyCategory[];
  className?: string;
}

interface TechnologyCardProps {
  technology: Technology;
  variant?: 'default' | 'compact' | 'detailed';
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ 
  technology, 
  variant = 'default' 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'learning': return 'text-blue-400 bg-blue-400/20';
      case 'expert': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-primary-400 bg-primary-400/20';
    }
  };

  const getProficiencyColor = (level: number) => {
    if (level >= 80) return 'from-green-500 to-green-600';
    if (level >= 60) return 'from-blue-500 to-blue-600';
    if (level >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="group"
      >
        <GlassCard className="p-4 h-full hover:bg-dark-800/30 transition-all duration-300">
          <div className="flex items-center space-x-3">
            {technology.image || technology.icon ? (
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src={technology.image || technology.icon}
                  alt={technology.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded flex items-center justify-center flex-shrink-0">
                <FiCode className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-white truncate">
                  {technology.name}
                </h3>
                {technology.isFeatured && (
                  <FiStar className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-primary-300 truncate">
                {technology.category.replace('_', ' ')}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-8 bg-dark-700/50 rounded-full h-1">
                <div
                  className={`bg-gradient-to-r ${getProficiencyColor(technology.proficiencyLevel)} h-1 rounded-full`}
                  style={{ width: `${technology.proficiencyLevel}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <GlassCard className="p-6 h-full hover:bg-dark-800/30 transition-all duration-300 relative overflow-hidden">
        {/* Featured Badge */}
        {technology.isFeatured && (
          <div className="absolute top-4 right-4">
            <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        )}

        {/* Technology Image/Icon */}
        <div className="flex justify-center mb-4">
          {technology.image || technology.icon ? (
            <div className="w-16 h-16 relative">
              <Image
                src={technology.image || technology.icon}
                alt={technology.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center">
              <FiCode className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Technology Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
            {technology.name}
          </h3>
          <p className="text-primary-300 text-sm mb-3 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const
          }}>
            {technology.description}
          </p>

          {/* Status and Category */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(technology.status)}`}>
              {technology.status}
            </span>
            <span className="px-2 py-1 bg-dark-700/50 text-primary-300 rounded-full text-xs">
              {technology.category.replace('_', ' ')}
            </span>
          </div>

          {/* Proficiency Level */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-primary-300 mb-1">
              <span>Proficiency</span>
              <span>{technology.proficiencyLevel}%</span>
            </div>
            <div className="w-full bg-dark-700/50 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getProficiencyColor(technology.proficiencyLevel)} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${technology.proficiencyLevel}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          {technology.tags && technology.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {technology.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full border border-primary-500/20"
                >
                  {tag}
                </span>
              ))}
              {technology.tags.length > 3 && (
                <span className="px-2 py-1 bg-dark-700/50 text-primary-300 text-xs rounded-full">
                  +{technology.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {technology.officialWebsite && (
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => window.open(technology.officialWebsite, '_blank')}
              className="text-primary-400 hover:text-white"
            >
              <FiExternalLink size={16} />
              Learn More
            </EnhancedButton>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const TechnologyShowcase: React.FC<TechnologyShowcaseProps> = ({
  title = "Technologies",
  subtitle = "Explore the technologies I work with",
  showFilters = false,
  showSearch = false,
  featuredOnly = false,
  limit = 12,
  categories,
  className = ""
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: featuredTechnologies, isLoading: featuredLoading } = usePublicFeaturedTechnologies(
    featuredOnly ? limit : 6
  );

  const { data: allTechnologies, isLoading: allLoading } = usePublicTechnologies({
    category: selectedCategory as TechnologyCategory,
    search: searchQuery,
    limit: featuredOnly ? 0 : limit,
    page: 1
  });

  const { data: categoryOptions } = usePublicTechnologyCategories();

  const technologies = featuredOnly ? featuredTechnologies : allTechnologies?.technologies;
  const isLoading = featuredOnly ? featuredLoading : allLoading;

  const filteredCategories = categories 
    ? categoryOptions?.filter(cat => categories.includes(cat.value as TechnologyCategory))
    : categoryOptions;

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary-300 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Filters and Search */}
      {(showFilters || showSearch) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              {showSearch && (
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="
                      w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-primary-500/20 rounded-xl
                      text-white placeholder-primary-400 focus:outline-none focus:border-primary-500/50
                      focus:bg-dark-800/70 transition-all duration-200
                    "
                  />
                </div>
              )}

              {/* Category Filter */}
              {showFilters && filteredCategories && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="
                    px-4 py-3 bg-dark-800/50 border border-primary-500/20 rounded-xl
                    text-white focus:outline-none focus:border-primary-500/50
                    focus:bg-dark-800/70 transition-all duration-200
                  "
                >
                  <option value="">All Categories</option>
                  {filteredCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              )}

              {/* View Mode Toggle */}
              {!featuredOnly && (
                <div className="flex items-center bg-dark-800/50 rounded-xl p-1 border border-primary-500/20">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      ${viewMode === 'grid' 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-primary-300 hover:text-white hover:bg-primary-500/10'
                      }
                    `}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      ${viewMode === 'list' 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-primary-300 hover:text-white hover:bg-primary-500/10'
                      }
                    `}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Technologies Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-64 bg-dark-800/30 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : technologies && technologies.length > 0 ? (
          <div className={`
            grid gap-6
            ${viewMode === 'list' 
              ? 'grid-cols-1 lg:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }
          `}>
            {technologies.map((technology, index) => (
              <motion.div
                key={technology._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TechnologyCard 
                  technology={technology} 
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiCode className="w-16 h-16 text-primary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No technologies found</h3>
            <p className="text-primary-300">Try adjusting your search or filters.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};
