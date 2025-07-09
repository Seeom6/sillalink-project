"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Grid, List, MoreVertical } from "lucide-react";
import { TechnologiesGrid } from "../components/technologies/TechnologiesGrid";
import { TechnologiesTable } from "../components/technologies/TechnologiesTable";
import { TechnologyFilters } from "../components/technologies/TechnologyFilters";
import { TechnologyStats } from "../components/technologies/TechnologyStats";
import Button from "@/app/shared/ui/button";
import { Input } from "@/app/shared/ui/input";
import { Card } from "@/app/shared/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/app/shared/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu";
import { useGetTechnologies, useGetTechnologyStats, useDeleteTechnology, useToggleFeatured } from "@/app/hooks/technology/useTechnology";
import { TechnologyFilters as TechnologyFiltersType } from "@/app/types/technologyTypes";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";

export default function TechnologiesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TechnologyFiltersType>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    technologyId: string | null;
    technologyName: string;
  }>({
    isOpen: false,
    technologyId: null,
    technologyName: "",
  });

  // Featured toggle confirmation dialog state
  const [featuredDialog, setFeaturedDialog] = useState<{
    isOpen: boolean;
    technologyId: string | null;
    technologyName: string;
    currentFeaturedStatus: boolean;
  }>({
    isOpen: false,
    technologyId: null,
    technologyName: "",
    currentFeaturedStatus: false,
  });

  // Combine search term with filters
  const queryFilters = {
    ...filters,
    search: searchTerm || undefined
  };

  const { data: technologiesResponse, isLoading, error } = useGetTechnologies(queryFilters);
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetTechnologyStats();
  const deleteTechnologyMutation = useDeleteTechnology();
  const toggleFeaturedMutation = useToggleFeatured();

  const technologies = technologiesResponse?.data || [];
  const totalCount = technologiesResponse?.pagination?.total || 0;
  const totalPages = technologiesResponse?.pagination?.totalPages || 1;



  const handleAddTechnology = () => {
    router.push("/admin/technologies/add");
  };

  const handleEditTechnology = (id: string) => {
    router.push(`/admin/technologies/edit/${id}`);
  };

  const handleViewTechnology = (id: string) => {
    router.push(`/admin/technologies/view/${id}`);
  };

  const handleDeleteTechnology = (id: string) => {
    const technology = technologies.find(tech => tech._id === id);
    if (technology) {
      setDeleteDialog({
        isOpen: true,
        technologyId: id,
        technologyName: technology.name,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.technologyId) {
      deleteTechnologyMutation.mutate(deleteDialog.technologyId, {
        onSuccess: () => {
          setDeleteDialog({
            isOpen: false,
            technologyId: null,
            technologyName: "",
          });
        },
        onError: () => {
          // Error is handled by the mutation hook
        }
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      technologyId: null,
      technologyName: "",
    });
  };

  const handleToggleFeatured = (id: string) => {
    const technology = technologies.find(tech => tech._id === id);
    if (technology) {
      setFeaturedDialog({
        isOpen: true,
        technologyId: id,
        technologyName: technology.name,
        currentFeaturedStatus: technology.isFeatured,
      });
    }
  };

  const handleConfirmToggleFeatured = () => {
    if (featuredDialog.technologyId) {
      toggleFeaturedMutation.mutate(
        {
          id: featuredDialog.technologyId,
          currentStatus: featuredDialog.currentFeaturedStatus
        },
        {
          onSuccess: () => {
            setFeaturedDialog({
              isOpen: false,
              technologyId: null,
              technologyName: "",
              currentFeaturedStatus: false,
            });
          },
          onError: () => {
            // Error is handled by the mutation hook
          }
        }
      );
    }
  };

  const handleCancelToggleFeatured = () => {
    setFeaturedDialog({
      isOpen: false,
      technologyId: null,
      technologyName: "",
      currentFeaturedStatus: false,
    });
  };

  const handleFiltersChange = (newFilters: Partial<TechnologyFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: "createdAt",
      sortOrder: "desc"
    });
    setSearchTerm("");
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log("Bulk action:", action, selectedIds);
    // Implement bulk actions
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technologies</h1>
          <p className="text-gray-600 mt-1">
            Manage your technology stack and skills
          </p>
        </div>
        <Button onClick={handleAddTechnology} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Technology
        </Button>
      </div>



      {/* Stats Cards */}
      {!statsLoading && !statsError && stats && <TechnologyStats stats={stats} />}
      {!statsLoading && !statsError && !stats && (
        <div className="mb-8">
          <TechnologyStats stats={{
            totalTechnologies: 0,
            featuredCount: 0,
            averageProficiencyLevel: 0,
            totalLearningHours: 0,
            categoriesCount: 0,
            statusCounts: {},
            difficultyDistribution: {}
          }} />
        </div>
      )}

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.keys(filters).some(key => 
              key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder' && 
              filters[key as keyof TechnologyFiltersType]
            ) && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2"></span>
            )}
          </Button>

          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.reload()}>
                Refresh
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetFilters}>
                Reset Filters
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Export")}>
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {technologies.length} of {totalCount} technologies
        </span>
        <span>
          Page {filters.page} of {totalPages}
        </span>
      </div>

      {/* Simple Test Rendering */}
      <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded">
        <h3 className="font-bold">🧪 Simple Test:</h3>
        <p>Technologies count: {technologies.length}</p>
        {technologies.length > 0 && (
          <div>
            <p>First technology: {technologies[0]?.name}</p>
            <ul className="list-disc list-inside">
              {technologies.map((tech, index) => (
                <li key={tech._id || index}>{tech.name} - {tech.category}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <TechnologiesGrid
          technologies={technologies}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditTechnology}
          onDelete={handleDeleteTechnology}
          onView={handleViewTechnology}
          onToggleFeatured={handleToggleFeatured}
          onAddTechnology={handleAddTechnology}
          pagination={{
            currentPage: filters.page || 1,
            totalPages,
            onPageChange: handlePageChange
          }}
        />
      ) : (
        <TechnologiesTable
          technologies={technologies}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditTechnology}
          onDelete={handleDeleteTechnology}
          onView={handleViewTechnology}
          onToggleFeatured={handleToggleFeatured}
          onBulkAction={handleBulkAction}
          pagination={{
            currentPage: filters.page || 1,
            totalPages,
            onPageChange: handlePageChange
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Technology"
        message={`Are you sure you want to delete "${deleteDialog.technologyName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteTechnologyMutation.isPending}
      />

      {/* Featured Toggle Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={featuredDialog.isOpen}
        onClose={handleCancelToggleFeatured}
        onConfirm={handleConfirmToggleFeatured}
        title={featuredDialog.currentFeaturedStatus ? "Remove from Featured" : "Mark as Featured"}
        message={
          featuredDialog.currentFeaturedStatus
            ? `Remove "${featuredDialog.technologyName}" from featured technologies?`
            : `Mark "${featuredDialog.technologyName}" as a featured technology?`
        }
        confirmText={featuredDialog.currentFeaturedStatus ? "Remove" : "Mark Featured"}
        cancelText="Cancel"
        variant={featuredDialog.currentFeaturedStatus ? "warning" : "info"}
        isLoading={toggleFeaturedMutation.isPending}
      />
    </div>
  );
}
