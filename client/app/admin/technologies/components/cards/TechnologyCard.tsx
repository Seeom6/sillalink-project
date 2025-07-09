"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import { Star, StarOff } from 'lucide-react';
import { Technology } from '@/app/types/technologyTypes';
import { Card } from '@/app/shared/ui/Card';
import { Badge } from '@/app/shared/ui/badge';
import { TechnologyActions } from '../actions/TechnologyActions';

// Utility functions
const isValidImageUrl = (imageUrl: string | undefined): imageUrl is string => {
  return Boolean(
    imageUrl &&
    typeof imageUrl === 'string' &&
    imageUrl !== 'undefined' &&
    imageUrl.trim().length > 0 &&
    !imageUrl.includes('/undefined')
  );
};

const formatCategory = (category: string): string => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    deprecated: 'bg-red-100 text-red-800',
    learning: 'bg-blue-100 text-blue-800',
    expert: 'bg-purple-100 text-purple-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

const getDifficultyColor = (difficulty: string): string => {
  const colorMap: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800'
  };
  return colorMap[difficulty] || 'bg-gray-100 text-gray-800';
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const DISPLAY = {
  TRUNCATE_LENGTHS: {
    CARD_DESCRIPTION: 100,
    CARD_TITLE: 30
  }
};

interface TechnologyCardProps {
  technology: Technology;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export const TechnologyCard = memo<TechnologyCardProps>(({
  technology,
  onEdit,
  onDelete,
  onView,
  onToggleFeatured
}) => {

  const imageUrl = technology.image || technology.icon;
  const hasValidImage = isValidImageUrl(imageUrl);

  const handleCardClick = () => {
    onView(technology._id);
  };

  const handleToggleFeatured = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFeatured(technology._id);
  };

  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon/Image */}
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {hasValidImage ? (
              <Image
                src={imageUrl}
                alt={technology.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {technology.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {truncateText(technology.name, DISPLAY.TRUNCATE_LENGTHS.CARD_TITLE)}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {truncateText(technology.description, DISPLAY.TRUNCATE_LENGTHS.CARD_DESCRIPTION)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <TechnologyActions
          technology={technology}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onToggleFeatured={onToggleFeatured}
        />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className={getStatusColor(technology.status)}>
          {formatStatus(technology.status)}
        </Badge>
        <Badge variant="outline" className={getDifficultyColor(technology.difficultyLevel)}>
          {technology.difficultyLevel}
        </Badge>
        <Badge variant="outline">
          {formatCategory(technology.category)}
        </Badge>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>Proficiency: {technology.proficiencyLevel}%</span>
          <span>Projects: {technology.projectsUsedIn || 0}</span>
        </div>
        
        {/* Featured Star */}
        <button
          onClick={handleToggleFeatured}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          title={technology.isFeatured ? 'Remove from featured' : 'Add to featured'}
        >
          {technology.isFeatured ? (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          ) : (
            <StarOff className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </Card>
  );
});

TechnologyCard.displayName = 'TechnologyCard';
