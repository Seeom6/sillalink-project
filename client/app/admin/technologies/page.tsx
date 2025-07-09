"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Grid, List, MoreVertical } from "lucide-react";
import { TechnologiesGrid } from "./components";
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
import { useTechnologies, useTechnologyActions } from "@/app/hooks/technology/useTechnology";
import { TechnologyFilters as TechnologyFiltersType } from "@/app/types/technologyTypes";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";
import { globalEvents, EVENTS } from "@/app/utils/eventEmitter";

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
  const queryFilters: TechnologyFiltersType = {
    ...filters,
    ...(searchTerm && { search: searchTerm })
  };

  const {
    technologies: technologiesData,
    loading: isLoading,
    error,
    pagination,
    refreshTechnologies
  } = useTechnologies(queryFilters);

  const {
    deleteTechnology: deleteTechnologyAction,
    toggleFeatured: toggleFeaturedAction,
    loading: actionLoading
  } = useTechnologyActions();

  const technologies = technologiesData || [];
  const totalCount = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  // 🔧 Fix: Refresh data when page becomes visible or when navigating back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshTechnologies();
      }
    };

    const handleFocus = () => {
      refreshTechnologies();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshTechnologies]);

  // 🔧 Fix: Refresh data on component mount (when navigating back)
  useEffect(() => {
    refreshTechnologies();
  }, []); // Empty dependency array means this runs once on mount

  // 🔧 Fix: Listen for technology update events
  useEffect(() => {
    const handleTechnologyUpdated = (updatedTechnology: any) => {
      refreshTechnologies();
    };

    // Listen for technology update events
    globalEvents.on(EVENTS.TECHNOLOGY_UPDATED, handleTechnologyUpdated);

    // Cleanup
    return () => {
      globalEvents.off(EVENTS.TECHNOLOGY_UPDATED, handleTechnologyUpdated);
    };
  }, [refreshTechnologies]);

  const handleAddTechnology = () => {
    router.push("/admin/technologies/add");
  };

  const handleEditTechnology = (id: string) => {
    // Validate ID before navigation
    if (!id || id === 'undefined') {
      alert('Error: Cannot edit technology - invalid ID. Please refresh the page and try again.');
      return;
    }

    router.push(`/admin/technologies/edit/${id}`);
  };

  const handleViewTechnology = (id: string) => {
    router.push(`/admin/technologies/view/${id}`);
  };

  const handleDeleteTechnology = (id: string) => {
    // Validate the incoming ID
    if (!id || typeof id !== 'string' || id === 'undefined') {
      alert('Error: Cannot delete technology - invalid ID. Please refresh the page and try again.');
      return;
    }

    // Find the technology by ID
    const technology = technologies.find(tech => tech._id === id);

    if (technology) {
      setDeleteDialog({
        isOpen: true,
        technologyId: id,
        technologyName: technology.name,
      });
    } else {
      // Fallback: try to get technology data directly from API
      handleDeleteTechnologyFallback(id);
    }
  };

  const handleDeleteTechnologyFallback = async (id: string) => {
    try {
      // Try to refresh technologies first to get the latest data
      refreshTechnologies();

      // Try to find the technology again after refresh
      const updatedTechnology = technologies.find(tech => tech._id === id);

      if (updatedTechnology) {
        setDeleteDialog({
          isOpen: true,
          technologyId: id,
          technologyName: updatedTechnology.name,
        });
      } else {
        // Set dialog with ID only, we'll show a generic message
        setDeleteDialog({
          isOpen: true,
          technologyId: id,
          technologyName: `Technology (ID: ${id.slice(-8)})`, // Show last 8 chars of ID
        });
      }
    } catch (error) {
      // Fallback delete failed - silently handle
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.technologyId) {
      return;
    }

    try {
      const success = await deleteTechnologyAction(deleteDialog.technologyId);

      if (success) {
        // Close dialog first
        setDeleteDialog({
          isOpen: false,
          technologyId: null,
          technologyName: "",
        });

        // Refresh the technologies list
        refreshTechnologies();
      }
      // If delete failed, the error message is already shown by the deleteTechnologyAction
    } catch (error) {
      // Keep dialog open on unexpected errors
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

  const handleConfirmToggleFeatured = async () => {
    if (featuredDialog.technologyId) {
      const result = await toggleFeaturedAction(featuredDialog.technologyId);
      if (result) {
        setFeaturedDialog({
          isOpen: false,
          technologyId: null,
          technologyName: "",
          currentFeaturedStatus: false,
        });
        refreshTechnologies();
      }
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Technologies</h3>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Featured</h3>
          <p className="text-2xl font-bold text-blue-600">
            {technologies.filter(tech => tech.isFeatured).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-green-600">
            {new Set(technologies.map(tech => tech.category)).size}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-purple-600">
            {technologies.filter(tech => tech.status === 'active').length}
          </p>
        </div>
      </div>

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
              <DropdownMenuItem onClick={() => {}}>
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
        isLoading={actionLoading}
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
        isLoading={actionLoading}
      />
    </div>
  );
}
