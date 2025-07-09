"use client";

import React, { memo } from 'react';
import { Technology } from '@/app/types/technologyTypes';
import { LoadingState } from '@/app/shared/components/data-display/LoadingState';
import { EmptyState } from '@/app/shared/components/data-display/EmptyState';
import { Pagination } from '@/app/shared/components/navigation/Pagination';
import { TechnologyCard } from '../cards/TechnologyCard';

// Constants for display
const DISPLAY = {
  LOADING_SKELETON_COUNT: 6,
  GRID_BREAKPOINTS: {
    SM: 1,
    MD: 2,
    LG: 3,
    XL: 4
  }
};

interface TechnologiesGridProps {
  technologies: Technology[];
  isLoading: boolean;
  error: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onAddTechnology: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export const TechnologiesGrid = memo<TechnologiesGridProps>(({
  technologies,
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
  onToggleFeatured,
  onAddTechnology,
  pagination
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState 
          variant="admin" 
          type="grid" 
          count={DISPLAY.LOADING_SKELETON_COUNT} 
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="Error Loading Technologies"
          description={error.message || "Failed to load technologies. Please try again."}
          actionLabel="Try Again"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  // Empty state
  if (!technologies || technologies.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="No Technologies Found"
          description="Get started by adding your first technology to track your skills and projects."
          actionLabel="Add Technology"
          onAction={onAddTechnology}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className={`
        grid gap-6
        grid-cols-${DISPLAY.GRID_BREAKPOINTS.SM}
        md:grid-cols-${DISPLAY.GRID_BREAKPOINTS.MD}
        lg:grid-cols-${DISPLAY.GRID_BREAKPOINTS.LG}
        xl:grid-cols-${DISPLAY.GRID_BREAKPOINTS.XL}
      `}>
        {technologies.map((technology) => (
          <TechnologyCard
            key={technology._id}
            technology={technology}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onToggleFeatured={onToggleFeatured}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
});

TechnologiesGrid.displayName = 'TechnologiesGrid';
