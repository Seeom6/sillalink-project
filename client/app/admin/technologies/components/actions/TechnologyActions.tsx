"use client";

import React, { memo } from 'react';
import { MoreVertical, Edit, Trash2, Eye, Star, StarOff, ExternalLink } from 'lucide-react';
import { Technology } from '@/app/types/technologyTypes';
import Button from '@/app/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/shared/ui/dropdown-menu';
// Utility functions
const isValidTechnologyId = (id: string | undefined): id is string => {
  return Boolean(id && typeof id === 'string' && id !== 'undefined' && id.trim().length > 0);
};

const ERROR_MESSAGES = {
  INVALID_ID: 'Invalid technology ID. Please refresh the page and try again.',
};

interface TechnologyActionsProps {
  technology: Technology;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  variant?: 'dropdown' | 'inline';
}

export const TechnologyActions = memo<TechnologyActionsProps>(({
  technology,
  onEdit,
  onDelete,
  onView,
  onToggleFeatured,
  variant = 'dropdown'
}) => {
  const handleAction = (action: () => void, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isValidTechnologyId(technology._id)) {
      alert(ERROR_MESSAGES.INVALID_ID);
      return;
    }
    
    action();
  };

  const handleEdit = (e: React.MouseEvent) => {
    handleAction(() => onEdit(technology._id), e);
  };

  const handleDelete = (e: React.MouseEvent) => {
    handleAction(() => onDelete(technology._id), e);
  };

  const handleView = (e: React.MouseEvent) => {
    handleAction(() => onView(technology._id), e);
  };

  const handleToggleFeatured = (e: React.MouseEvent) => {
    handleAction(() => onToggleFeatured(technology._id), e);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (technology.officialWebsite) {
      window.open(technology.officialWebsite, '_blank', 'noopener,noreferrer');
    }
  };

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleFeatured}
          title={technology.isFeatured ? 'Remove from featured' : 'Add to featured'}
        >
          {technology.isFeatured ? (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          ) : (
            <StarOff className="w-4 h-4" />
          )}
        </Button>
        {technology.officialWebsite && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExternalLink}
            title="Visit Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          title="Delete"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleFeatured}>
          {technology.isFeatured ? (
            <React.Fragment>
              <StarOff className="w-4 h-4 mr-2" />
              Remove from Featured
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Star className="w-4 h-4 mr-2" />
              Add to Featured
            </React.Fragment>
          )}
        </DropdownMenuItem>
        {technology.officialWebsite && (
          <DropdownMenuItem onClick={handleExternalLink}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Website
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

TechnologyActions.displayName = 'TechnologyActions';
