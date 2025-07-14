'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList,
  FiDownload,
  FiUpload,
  FiRefreshCw
} from 'react-icons/fi';
import { useTechnologies, useTechnologyFilters, useDeleteTechnology } from '@/lib/hooks/use-technologies';
import { TechnologyFilters, Technology } from '@/lib/types/technology';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import Link from 'next/link';

// Component imports
import { TechnologyGrid } from './components/TechnologyGrid';
import { TechnologyTable } from './components/TechnologyTable';
import { TechnologyFiltersPanel } from './components/TechnologyFiltersPanel';
import { TechnologyStats } from './components/TechnologyStats';
import { TechnologyModal } from './components/TechnologyModal';
import { BulkActionsBar } from './components/BulkActionsBar';

type ViewMode = 'grid' | 'table';

export default function TechnologiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    technologyId: string | null;
    technologyName: string;
  }>({
    isOpen: false,
    technologyId: null,
    technologyName: ''
  });

  const { filters, updateFilters, resetFilters } = useTechnologyFilters({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const {
    data: technologiesData,
    isLoading,
    error,
    refetch
  } = useTechnologies({
    ...filters,
    search: searchQuery
  });

  const deleteTechnology = useDeleteTechnology();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters({ page: 1 });
  };

  const handleFilterChange = (newFilters: Partial<TechnologyFilters>) => {
    updateFilters(newFilters);
  };

  const handleViewTechnology = (technology: Technology) => {
    setSelectedTechnology(technology);
    setIsModalOpen(true);
  };

  const handleEditTechnology = (technology: Technology) => {
    // Navigate to edit page
    window.location.href = `/admin/technologies/edit/${technology._id}`;
  };

  const handleDeleteTechnology = (id: string) => {
    // Find the technology to get its name for confirmation
    const technology = technologiesData?.technologies?.find(tech => tech._id === id);
    const technologyName = technology?.name || 'Unknown Technology';

    // Show confirmation dialog
    setDeleteConfirmation({
      isOpen: true,
      technologyId: id,
      technologyName
    });
  };

  const confirmDeleteTechnology = async () => {
    if (!deleteConfirmation.technologyId) return;

    try {
      await deleteTechnology.mutateAsync(deleteConfirmation.technologyId);

      // Remove from selected technologies if it was selected
      setSelectedTechnologies(prev => prev.filter(techId => techId !== deleteConfirmation.technologyId));

      // Close modal if the deleted technology was being viewed
      if (selectedTechnology?._id === deleteConfirmation.technologyId) {
        setIsModalOpen(false);
        setSelectedTechnology(null);
      }

      // Close confirmation dialog
      setDeleteConfirmation({
        isOpen: false,
        technologyId: null,
        technologyName: ''
      });
    } catch (error) {
      console.error('Failed to delete technology:', error);
      // Error is already handled by the mutation hook with toast
    }
  };

  const cancelDeleteTechnology = () => {
    setDeleteConfirmation({
      isOpen: false,
      technologyId: null,
      technologyName: ''
    });
  };

  const handleSelectTechnology = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedTechnologies(prev => [...prev, id]);
    } else {
      setSelectedTechnologies(prev => prev.filter(techId => techId !== id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected && technologiesData?.technologies) {
      setSelectedTechnologies(technologiesData.technologies.map(tech => tech._id));
    } else {
      setSelectedTechnologies([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Technology Management</h1>
          <p className="text-primary-300 mt-2">
            Manage your technology stack and expertise levels
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <EnhancedButton
            variant="outline"
            onClick={() => refetch()}
            className="border-primary-500/30 hover:border-primary-500/50"
          >
            <FiRefreshCw size={16} />
            Refresh
          </EnhancedButton>
          
          <Link href="/admin/technologies/create">
            <EnhancedButton variant="gradient" glow>
              <FiPlus size={16} />
              Add Technology
            </EnhancedButton>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <TechnologyStats />

      {/* Search and Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="
                w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-primary-500/20 rounded-xl
                text-white placeholder-primary-400 focus:outline-none focus:border-primary-500/50
                focus:bg-dark-800/70 transition-all duration-200
              "
            />
          </div>

          {/* View Mode Toggle */}
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
              onClick={() => setViewMode('table')}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${viewMode === 'table' 
                  ? 'bg-primary-500/20 text-primary-400' 
                  : 'text-primary-300 hover:text-white hover:bg-primary-500/10'
                }
              `}
            >
              <FiList size={18} />
            </button>
          </div>

          {/* Filters Toggle */}
          <EnhancedButton
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`
              border-primary-500/30 hover:border-primary-500/50
              ${showFilters ? 'bg-primary-500/10 border-primary-500/50' : ''}
            `}
          >
            <FiFilter size={16} />
            Filters
          </EnhancedButton>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-primary-500/20 mt-6">
                <TechnologyFiltersPanel
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  onReset={resetFilters}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedTechnologies.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedTechnologies.length}
            selectedIds={selectedTechnologies}
            onClearSelection={() => setSelectedTechnologies([])}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-primary-300">Loading technologies...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400">Error loading technologies</div>
          </div>
        ) : viewMode === 'grid' ? (
          <TechnologyGrid
            technologies={technologiesData?.technologies || []}
            selectedIds={selectedTechnologies}
            onSelect={handleSelectTechnology}
            onSelectAll={handleSelectAll}
            onView={handleViewTechnology}
            onEdit={handleEditTechnology}
            onDelete={handleDeleteTechnology}
            pagination={{
              page: technologiesData?.page || 1,
              limit: technologiesData?.limit || 12,
              total: technologiesData?.total || 0,
              totalPages: technologiesData?.totalPages || 1
            }}
            onPageChange={(page) => updateFilters({ page })}
          />
        ) : (
          <TechnologyTable
            technologies={technologiesData?.technologies || []}
            selectedIds={selectedTechnologies}
            onSelect={handleSelectTechnology}
            onSelectAll={handleSelectAll}
            onView={handleViewTechnology}
            onEdit={handleEditTechnology}
            onDelete={handleDeleteTechnology}
            pagination={{
              page: technologiesData?.page || 1,
              limit: technologiesData?.limit || 12,
              total: technologiesData?.total || 0,
              totalPages: technologiesData?.totalPages || 1
            }}
            onPageChange={(page) => updateFilters({ page })}
            onSort={(field, order) => updateFilters({ sortBy: field, sortOrder: order })}
          />
        )}
      </div>

      {/* Technology Detail Modal */}
      <TechnologyModal
        technology={selectedTechnology}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTechnology(null);
        }}
        onEdit={handleEditTechnology}
        onDelete={handleDeleteTechnology}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={cancelDeleteTechnology}
        onConfirm={confirmDeleteTechnology}
        title="Delete Technology"
        message={`Are you sure you want to delete "${deleteConfirmation.technologyName}"? This action cannot be undone and will permanently remove all associated data.`}
        confirmText="Delete Technology"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteTechnology.isPending}
      />
    </div>
  );
}
