"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, Eye, Star, StarOff } from "lucide-react";
import { Technology } from "@/app/types/technologyTypes";
import { Card } from "@/app/shared/ui/Card";
import Button from "@/app/shared/ui/button";
import { Badge } from "@/app/shared/ui/badge";
import { Checkbox } from "@/app/shared/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/ui/table";
import { LoadingState } from "@/app/shared/components/data-display/LoadingState";
import { EmptyState } from "@/app/shared/components/data-display/EmptyState";
import { Pagination } from "@/app/shared/components/navigation/Pagination";
import Image from "next/image";

interface TechnologiesTableProps {
  technologies: Technology[];
  isLoading: boolean;
  error: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export const TechnologiesTable = ({
  technologies,
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
  onToggleFeatured,
  onBulkAction,
  pagination
}: TechnologiesTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(technologies.map(tech => tech._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleToggleFeatured = (id: string) => {
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

  if (error) {
    return (
      <Card className="p-6 text-center text-red-600">
        Error loading technologies: {error.message}
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingState variant="admin" type="table" count={10} />;
  }

  if (technologies.length === 0) {
    return (
      <EmptyState
        title="No technologies found"
        description="Get started by adding your first technology to showcase your skills."
        variant="admin"
        actionLabel="Add Your First Technology"
        onAction={() => {}}
      />
    );
  }

  const isAllSelected = selectedIds.length === technologies.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < technologies.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction("delete", selectedIds)}
              >
                Delete Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction("feature", selectedIds)}
              >
                Toggle Featured
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Technology</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proficiency</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technologies.map((technology) => (
              <TableRow key={technology._id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(technology._id)}
                    onCheckedChange={(checked) => handleSelectOne(technology._id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {technology.icon ? (
                        <Image
                          src={technology.icon}
                          alt={technology.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                          {technology.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {technology.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {technology.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(technology.category)}>
                    {technology.category.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(technology.status)}>
                    {technology.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${technology.proficiencyLevel}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {technology.proficiencyLevel}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900">
                    {technology.projectsUsedIn}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(technology._id)}
                  >
                    {technology.isFeatured ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(technology._id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(technology._id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(technology._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

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
