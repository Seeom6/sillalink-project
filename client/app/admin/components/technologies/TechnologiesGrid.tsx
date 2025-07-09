"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, Eye, Star, StarOff, ExternalLink } from "lucide-react";
import { Technology } from "@/app/types/technologyTypes";
import { Card } from "@/app/shared/ui/Card";
import Button from "@/app/shared/ui/button";
import { Badge } from "@/app/shared/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu";
import { LoadingState } from "@/app/shared/components/data-display/LoadingState";
import { EmptyState } from "@/app/shared/components/data-display/EmptyState";
import { Pagination } from "@/app/shared/components/navigation/Pagination";
import Image from "next/image";

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

export const TechnologiesGrid = ({
  technologies,
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
  onToggleFeatured,
  onAddTechnology,
  pagination
}: TechnologiesGridProps) => {
  const handleToggleFeatured = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFeatured(id);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      frontend: "bg-blue-100 text-blue-800",
      backend: "bg-green-100 text-green-800",
      database: "bg-purple-100 text-purple-800",
      mobile: "bg-pink-100 text-pink-800",
      devops: "bg-orange-100 text-orange-800",
      design: "bg-indigo-100 text-indigo-800",
      testing: "bg-yellow-100 text-yellow-800",
      ai_ml: "bg-red-100 text-red-800",
      blockchain: "bg-gray-100 text-gray-800",
      cloud: "bg-cyan-100 text-cyan-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      deprecated: "bg-red-100 text-red-800",
      learning: "bg-blue-100 text-blue-800",
      expert: "bg-purple-100 text-purple-800"
    };
    return colors[status] || colors.active;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800"
    };
    return colors[difficulty] || colors.beginner;
  };

  if (error) {
    return (
      <Card className="p-6 text-center text-red-600">
        Error loading technologies: {error.message}
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingState variant="admin" type="grid" count={12} />;
  }

  if (technologies.length === 0) {
    return (
      <EmptyState
        title="No technologies found"
        description="Get started by adding your first technology to showcase your skills."
        variant="admin"
        actionLabel="Add Your First Technology"
        onAction={onAddTechnology}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {technologies.map((technology) => (
          <Card
            key={technology._id}
            className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onView(technology._id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icon/Image */}
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {technology.icon ? (
                    <Image
                      src={technology.icon}
                      alt={technology.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {technology.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Title and Featured */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {technology.name}
                    </h3>
                    {technology.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {technology.version && `v${technology.version}`}
                  </p>
                </div>
              </div>

              {/* Actions */}
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
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onView(technology._id);
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(technology._id);
                  }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleToggleFeatured(technology._id, e)}>
                    {technology.isFeatured ? (
                      <>
                        <StarOff className="w-4 h-4 mr-2" />
                        Remove from Featured
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Add to Featured
                      </>
                    )}
                  </DropdownMenuItem>
                  {technology.officialWebsite && (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      window.open(technology.officialWebsite, '_blank');
                    }}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(technology._id);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {technology.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getCategoryColor(technology.category)}>
                {technology.category.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(technology.status)}>
                {technology.status.toUpperCase()}
              </Badge>
              <Badge className={getDifficultyColor(technology.difficultyLevel)}>
                {technology.difficultyLevel.toUpperCase()}
              </Badge>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Proficiency: {technology.proficiencyLevel}%</span>
              <span>Projects: {technology.projectsUsedIn}</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${technology.proficiencyLevel}%` }}
                />
              </div>
            </div>

            {/* Tags */}
            {technology.tags && technology.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {technology.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {technology.tags.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    +{technology.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </Card>
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
};
