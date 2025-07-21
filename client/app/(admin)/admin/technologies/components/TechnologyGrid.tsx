'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiStar,
  FiCode,
  FiExternalLink
} from 'react-icons/fi';
import { Technology } from '@/lib/types/technology';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface TechnologyGridProps {
  technologies: Technology[];
  selectedIds: string[];
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onView: (technology: Technology) => void;
  onEdit: (technology: Technology) => void;
  onDelete: (id: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

interface TechnologyCardProps {
  technology: Technology;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Helper function to validate and format image URLs
const getValidImageUrl = (imageUrl: string | undefined): string | null => {
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // If it's already a full URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
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

const TechnologyCard: React.FC<TechnologyCardProps> = ({
  technology,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete
}) => {
  // Get the correct ID - use _id if available, otherwise use id
  const technologyId = technology._id || technology.id;
  const [imageError, setImageError] = React.useState(false);
  const imageUrl = getValidImageUrl(technology.image) || getValidImageUrl(technology.icon);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'learning': return 'text-blue-400 bg-blue-400/20';
      case 'expert': return 'text-purple-400 bg-purple-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      case 'deprecated': return 'text-red-400 bg-red-400/20';
      default: return 'text-primary-400 bg-primary-400/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-primary-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <GlassCard className="p-6 h-full hover:bg-dark-800/30 transition-all duration-300 relative">
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 text-primary-500 bg-dark-800 border-primary-500/30 rounded focus:ring-primary-500 focus:ring-2"
          />
        </div>

        {/* Featured Badge */}
        {technology.isFeatured && (
          <div className="absolute top-4 right-4">
            <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        )}

        {/* Technology Image/Icon */}
        <div className="flex justify-center mb-4 mt-6">
          {imageUrl && !imageError ? (
            <div className="w-16 h-16 relative">
              <Image
                src={imageUrl}
                alt={technology.name}
                fill
                className="object-contain rounded-lg"
                onError={() => {
                  setImageError(true);
                }}
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
              {technology.category}
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
                className="bg-gradient-to-r from-primary-500 to-accent-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${technology.proficiencyLevel}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          {technology.tags && technology.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {technology.tags.slice(0, 3).map((tag) => (
                <span
                  key={`${technology._id}-tag-${tag}`}
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

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div className="text-center">
              <div className="text-primary-300">Projects</div>
              <div className="text-white font-semibold">{technology.projectsUsedIn}</div>
            </div>
            <div className="text-center">
              <div className="text-primary-300">Difficulty</div>
              <div className={`font-semibold ${getDifficultyColor(technology.difficultyLevel)}`}>
                {technology.difficultyLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={onView}
            className="text-primary-400 hover:text-white"
          >
            <FiEye size={16} />
          </EnhancedButton>
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-blue-400 hover:text-white"
          >
            <FiEdit size={16} />
          </EnhancedButton>
          {technology.officialWebsite && (
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => window.open(technology.officialWebsite, '_blank')}
              className="text-green-400 hover:text-white"
            >
              <FiExternalLink size={16} />
            </EnhancedButton>
          )}
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-400 hover:text-white"
          >
            <FiTrash2 size={16} />
          </EnhancedButton>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const Pagination: React.FC<{
  pagination: TechnologyGridProps['pagination'];
  onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;
  
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-primary-300">
        Showing {startItem}-{endItem} of {total} technologies
      </div>
      
      <div className="flex items-center gap-2">
        <EnhancedButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="border-primary-500/30"
        >
          Previous
        </EnhancedButton>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + Math.max(1, page - 2);
          if (pageNum > totalPages) return null;
          
          return (
            <EnhancedButton
              key={pageNum}
              variant={pageNum === page ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={pageNum === page ? "" : "border-primary-500/30"}
            >
              {pageNum}
            </EnhancedButton>
          );
        })}
        
        <EnhancedButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="border-primary-500/30"
        >
          Next
        </EnhancedButton>
      </div>
    </div>
  );
};

export const TechnologyGrid: React.FC<TechnologyGridProps> = ({
  technologies,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  pagination,
  onPageChange
}) => {
  const allSelected = technologies.length > 0 && technologies.every(tech => selectedIds.includes(tech._id));
  const someSelected = technologies.some(tech => selectedIds.includes(tech._id));

  return (
    <div>
      {/* Select All */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected && !allSelected;
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 text-primary-500 bg-dark-800 border-primary-500/30 rounded focus:ring-primary-500 focus:ring-2"
          />
          <span className="text-sm text-primary-300">
            Select all ({technologies.length} technologies)
          </span>
        </label>
        
        {selectedIds.length > 0 && (
          <span className="text-sm text-primary-400">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Grid */}
      {technologies.length === 0 ? (
        <div className="text-center py-12">
          <FiCode className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No technologies found</h3>
          <p className="text-primary-300">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {technologies.map((technology, index) => {
            const technologyId = technology._id || technology.id;
            return (
              <TechnologyCard
                key={technologyId || `technology-${index}`}
                technology={technology}
                isSelected={selectedIds.includes(technologyId || technology._id)}
                onSelect={(selected) => onSelect(technologyId || technology._id, selected)}
                onView={() => onView(technology)}
                onEdit={() => onEdit(technology)}
                onDelete={() => onDelete(technologyId || technology._id)}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {technologies.length > 0 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};
