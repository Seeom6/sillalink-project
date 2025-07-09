"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Grid, List, Search, Filter } from "lucide-react";
import { useTechnologies } from "@/app/hooks/technology/useTechnology";
import Button from "@/app/shared/ui/button";
import { Input } from "@/app/shared/ui/input";
import { Card } from "@/app/shared/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/app/shared/ui/tabs";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";
import { TechnologyFilters as TechnologyFiltersType } from "@/app/types/technologyTypes";
import { 
  TechnologiesGrid, 
  TechnologiesTable, 
  TechnologyFilters, 
  TechnologyStats 
} from "./components";
import { useTechnologyActions, useTechnologyFilters } from "./hooks";
import { isValidTechnologyId, ERROR_MESSAGES, createConditionalFilters } from "./utils";

export default function TechnologiesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    technologyId: null as string | null,
    technologyName: "",
  });

  // Use optimized hooks
  const { filters, updateFilters, resetFilters, updatePage, hasActiveFilters, filterCount } = useTechnologyFilters();
  const technologyActions = useTechnologyActions();

  // Combine filters with search term, conditionally including search to satisfy exactOptionalPropertyTypes
  const combinedFilters = useMemo(() => {
    const trimmedSearch = searchTerm.trim();
    return createConditionalFilters({
      ...filters,
      search: trimmedSearch
    });
  }, [filters, searchTerm]);

  // Fetch technologies with combined filters
  const {
    technologies: technologiesData,
    loading: isLoading,
    error,
    pagination,
    refreshTechnologies
  } = useTechnologies(combinedFilters);

  const technologies = technologiesData || [];
  const totalCount = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  // Handlers
  const handleAddTechnology = useCallback(() => {
    router.push("/admin/technologies/add");
  }, [router]);

  const handleDeleteTechnology = useCallback((id: string) => {
    if (!isValidTechnologyId(id)) {
      alert(ERROR_MESSAGES.INVALID_ID);
      return;
    }

    const technology = technologies.find(tech => tech._id === id);
    if (technology) {
      setDeleteDialog({
        isOpen: true,
        technologyId: id,
        technologyName: technology.name,
      });
    } else {
      alert(ERROR_MESSAGES.NOT_FOUND);
    }
  }, [technologies]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog.technologyId) {
      return;
    }

    try {
      const success = await technologyActions.handleDelete(deleteDialog.technologyId);

      if (success) {
        setDeleteDialog({
          isOpen: false,
          technologyId: null,
          technologyName: "",
        });
        refreshTechnologies();
      }
    } catch (error) {
      // Error handling is done in the action hook
    }
  }, [deleteDialog.technologyId, technologyActions, refreshTechnologies]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({
      isOpen: false,
      technologyId: null,
      technologyName: "",
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: Partial<TechnologyFiltersType>) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    resetFilters();
  }, [resetFilters]);

  const handlePageChange = useCallback((page: number) => {
    updatePage(page);
  }, [updatePage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    // Reset to first page when searching
    updatePage(1);
  }, [updatePage]);

  const handleBulkAction = useCallback((action: string, selectedIds: string[]) => {
    // TODO: Implement bulk actions
    switch (action) {
      case 'delete':
        // Handle bulk delete
        break;
      case 'feature':
        // Handle bulk feature toggle
        break;
      default:
        // Unknown bulk action
        break;
    }
  }, []);

  // Memoized pagination object
  const paginationProps = useMemo(() => ({
    currentPage: filters.page || 1,
    totalPages,
    onPageChange: handlePageChange
  }), [filters.page, totalPages, handlePageChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technologies</h1>
          <p className="text-gray-600 mt-1">
            Manage your technology stack and skills ({totalCount} total)
          </p>
        </div>
        <Button onClick={handleAddTechnology}>
          <Plus className="w-4 h-4 mr-2" />
          Add Technology
        </Button>
      </div>

      {/* Stats */}
      <TechnologyStats stats={{
        totalTechnologies: totalCount,
        featuredCount: technologies.filter(tech => tech.isFeatured).length,
        averageProficiencyLevel: technologies.length > 0
          ? technologies.reduce((sum, tech) => sum + (tech.proficiencyLevel || 0), 0) / technologies.length
          : 0,
        totalLearningHours: technologies.reduce((sum, tech) => sum + (tech.estimatedLearningHours || 0), 0),
        byCategory: technologies.reduce((acc, tech) => {
          acc[tech.category] = (acc[tech.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: technologies.reduce((acc, tech) => {
          acc[tech.status] = (acc[tech.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byDifficultyLevel: technologies.reduce((acc, tech) => {
          acc[tech.difficultyLevel] = (acc[tech.difficultyLevel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }} />

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table">
                <List className="w-4 h-4 mr-2" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={hasActiveFilters ? "border-blue-500 text-blue-600" : ""}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {filterCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {filterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <TechnologyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>
        )}
      </Card>

      {/* Content */}
      {viewMode === "grid" ? (
        <TechnologiesGrid
          technologies={technologies}
          isLoading={isLoading}
          error={error}
          onEdit={technologyActions.handleEdit}
          onDelete={handleDeleteTechnology}
          onView={technologyActions.handleView}
          onToggleFeatured={technologyActions.handleToggleFeatured}
          onAddTechnology={handleAddTechnology}
          pagination={paginationProps}
        />
      ) : (
        <TechnologiesTable
          technologies={technologies}
          isLoading={isLoading}
          error={error}
          onEdit={technologyActions.handleEdit}
          onDelete={handleDeleteTechnology}
          onView={technologyActions.handleView}
          onToggleFeatured={technologyActions.handleToggleFeatured}
          onBulkAction={handleBulkAction}
          pagination={paginationProps}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Technology"
        message={`Are you sure you want to delete "${deleteDialog.technologyName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
}
