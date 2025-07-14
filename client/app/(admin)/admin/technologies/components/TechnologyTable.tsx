'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiStar, 
  FiExternalLink,
  FiCode,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import { Technology, TechnologySortField, SortOrder } from '@/lib/types/technology';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface TechnologyTableProps {
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
  onSort: (field: TechnologySortField, order: SortOrder) => void;
}

interface TableHeaderProps {
  label: string;
  field?: TechnologySortField;
  sortable?: boolean;
  currentSort?: { field: TechnologySortField; order: SortOrder };
  onSort?: (field: TechnologySortField, order: SortOrder) => void;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  label,
  field,
  sortable = false,
  currentSort,
  onSort,
  className = ''
}) => {
  const isSorted = currentSort?.field === field;
  const isAsc = isSorted && currentSort?.order === 'asc';

  const handleSort = () => {
    if (!sortable || !field || !onSort) return;
    const newOrder: SortOrder = isSorted && isAsc ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider ${className}`}>
      {sortable ? (
        <button
          onClick={handleSort}
          className="flex items-center space-x-1 hover:text-white transition-colors"
        >
          <span>{label}</span>
          {sortable && (
            <div className="flex flex-col">
              <FiChevronUp 
                size={12} 
                className={`${isSorted && isAsc ? 'text-primary-400' : 'text-primary-600'}`} 
              />
              <FiChevronDown 
                size={12} 
                className={`${isSorted && !isAsc ? 'text-primary-400' : 'text-primary-600'} -mt-1`} 
              />
            </div>
          )}
        </button>
      ) : (
        label
      )}
    </th>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'learning': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'expert': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'inactive': return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      case 'deprecated': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-primary-400 bg-primary-400/20 border-primary-400/30';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const ProficiencyBar: React.FC<{ level: number }> = ({ level }) => (
  <div className="flex items-center space-x-2">
    <div className="w-16 bg-dark-700/50 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-primary-500 to-accent-purple h-2 rounded-full transition-all duration-300"
        style={{ width: `${level}%` }}
      />
    </div>
    <span className="text-xs text-primary-300 w-8">{level}%</span>
  </div>
);

export const TechnologyTable: React.FC<TechnologyTableProps> = ({
  technologies,
  selectedIds,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  onSort
}) => {
  const allSelected = technologies.length > 0 && technologies.every(tech => selectedIds.includes(tech._id));
  const someSelected = technologies.some(tech => selectedIds.includes(tech._id));

  return (
    <div>
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-500/20">
            <thead className="bg-dark-800/30">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary-500 bg-dark-800 border-primary-500/30 rounded focus:ring-primary-500 focus:ring-2"
                  />
                </th>
                <TableHeader label="Technology" field="name" sortable onSort={onSort} />
                <TableHeader label="Category" field="category" sortable onSort={onSort} />
                <TableHeader label="Status" field="status" sortable onSort={onSort} />
                <TableHeader label="Proficiency" field="proficiencyLevel" sortable onSort={onSort} />
                <TableHeader label="Projects" field="projectsUsedIn" sortable onSort={onSort} />
                <TableHeader label="Difficulty" />
                <TableHeader label="Tags" />
                <TableHeader label="Created" field="createdAt" sortable onSort={onSort} />
                <TableHeader label="Actions" className="text-center" />
              </tr>
            </thead>
            <tbody className="bg-dark-900/20 divide-y divide-primary-500/10">
              {technologies.map((technology) => (
                <motion.tr
                  key={technology._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-dark-800/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(technology._id)}
                      onChange={(e) => onSelect(technology._id, e.target.checked)}
                      className="w-4 h-4 text-primary-500 bg-dark-800 border-primary-500/30 rounded focus:ring-primary-500 focus:ring-2"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {technology.image || technology.icon ? (
                        <div className="w-8 h-8 relative">
                          <Image
                            src={technology.image || technology.icon}
                            alt={technology.name}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded flex items-center justify-center">
                          <FiCode className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">{technology.name}</span>
                          {technology.isFeatured && (
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <div className="text-xs text-primary-300 truncate max-w-xs">
                          {technology.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-primary-300 capitalize">
                      {technology.category.replace('_', ' ')}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={technology.status} />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProficiencyBar level={technology.proficiencyLevel} />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {technology.projectsUsedIn}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-primary-300 capitalize">
                      {technology.difficultyLevel}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {technology.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full border border-primary-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {technology.tags.length > 2 && (
                        <span className="px-2 py-1 bg-dark-700/50 text-primary-300 text-xs rounded-full">
                          +{technology.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300">
                    {new Date(technology.createdAt).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <EnhancedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(technology)}
                        className="text-primary-400 hover:text-white"
                      >
                        <FiEye size={16} />
                      </EnhancedButton>
                      <EnhancedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(technology)}
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
                        onClick={() => onDelete(technology._id)}
                        className="text-red-400 hover:text-white"
                      >
                        <FiTrash2 size={16} />
                      </EnhancedButton>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {technologies.length > 0 && (
          <div className="px-6 py-4 border-t border-primary-500/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-primary-300">
                Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} technologies
              </div>
              
              <div className="flex items-center gap-2">
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="border-primary-500/30"
                >
                  Previous
                </EnhancedButton>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + Math.max(1, pagination.page - 2);
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <EnhancedButton
                      key={pageNum}
                      variant={pageNum === pagination.page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNum)}
                      className={pageNum === pagination.page ? "" : "border-primary-500/30"}
                    >
                      {pageNum}
                    </EnhancedButton>
                  );
                })}
                
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="border-primary-500/30"
                >
                  Next
                </EnhancedButton>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
      
      {technologies.length === 0 && (
        <div className="text-center py-12">
          <FiCode className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No technologies found</h3>
          <p className="text-primary-300">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};
