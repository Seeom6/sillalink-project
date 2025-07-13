import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument, ProjectStatus, ProjectPriority } from './project.schema';
import { BaseMongoRepository } from '@Package/database';

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  assignedEmployee?: string;
  technology?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  costMin?: number;
  costMax?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class ProjectRepository extends BaseMongoRepository<ProjectDocument> {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {
    super(projectModel);
  }

  async create(createProjectDto: any): Promise<ProjectDocument> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findByName(name: string): Promise<ProjectDocument> {
    return this.projectModel.findOne({ name, isDeleted: false }).exec();
  }

  async update(id: string, updateProjectDto: any): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateProjectDto },
        { new: true },
      )
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .populate('technologiesUsed', 'name category icon image')
      .exec();
  }

  async remove(id: string): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true },
      )
      .exec();
  }

  // Legacy methods for backward compatibility
  async addMember(id: string, memberId: string, ownerId?: string): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $addToSet: { assignedEmployees: memberId } },
        { new: true },
      )
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .exec();
  }

  async removeMember(id: string, memberId: string, ownerId?: string): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $pull: { assignedEmployees: memberId } },
        { new: true },
      )
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .exec();
  }

  async findAllWithFilters(filters: ProjectFilters): Promise<{
    projects: ProjectDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      status,
      priority,
      assignedEmployee,
      technology,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      costMin,
      costMax,
      isFeatured,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    // Build filter query
    const query: any = { isDeleted: false };

    // Text search
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Assigned employee filter
    if (assignedEmployee) {
      query.assignedEmployees = assignedEmployee;
    }

    // Technology filter
    if (technology) {
      query.technologiesUsed = technology;
    }

    // Date range filters
    if (startDateFrom || startDateTo) {
      query.startDate = {};
      if (startDateFrom) query.startDate.$gte = new Date(startDateFrom);
      if (startDateTo) query.startDate.$lte = new Date(startDateTo);
    }

    if (endDateFrom || endDateTo) {
      query.endDate = {};
      if (endDateFrom) query.endDate.$gte = new Date(endDateFrom);
      if (endDateTo) query.endDate.$lte = new Date(endDateTo);
    }

    // Cost range filters
    if (costMin !== undefined || costMax !== undefined) {
      query.cost = {};
      if (costMin !== undefined) query.cost.$gte = costMin;
      if (costMax !== undefined) query.cost.$lte = costMax;
    }

    // Featured filter
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [projects, total] = await Promise.all([
      this.projectModel
        .find(query)
        .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
        .populate('technologiesUsed', 'name category icon image')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.projectModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      projects,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findFeatured(limit: number = 6): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({
        isDeleted: false,
        isFeatured: true,
        status: { $ne: ProjectStatus.COMPLETED }
      })
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .populate('technologiesUsed', 'name category icon image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByStatus(status: ProjectStatus, limit: number = 10): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({
        isDeleted: false,
        status
      })
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .populate('technologiesUsed', 'name category icon image')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByEmployee(employeeId: string, limit: number = 10): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({
        isDeleted: false,
        assignedEmployees: employeeId
      })
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .populate('technologiesUsed', 'name category icon image')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByTechnology(technologyId: string, limit: number = 10): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({
        isDeleted: false,
        technologiesUsed: technologyId
      })
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .populate('technologiesUsed', 'name category icon image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async searchProjects(searchTerm: string, limit: number = 10): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({
        isDeleted: false,
        $text: { $search: searchTerm }
      })
      .populate('assignedEmployees', 'firstName lastName email employee.position employee.image')
      .populate('technologiesUsed', 'name category icon image')
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .exec();
  }

  async getProjectStats(): Promise<any> {
    const stats = await this.projectModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          activeProjects: {
            $sum: {
              $cond: [
                { $in: ['$status', [ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS]] },
                1,
                0
              ]
            }
          },
          completedProjects: {
            $sum: {
              $cond: [{ $eq: ['$status', ProjectStatus.COMPLETED] }, 1, 0]
            }
          },
          onHoldProjects: {
            $sum: {
              $cond: [{ $eq: ['$status', ProjectStatus.ON_HOLD] }, 1, 0]
            }
          },
          featuredProjects: {
            $sum: {
              $cond: ['$isFeatured', 1, 0]
            }
          },
          totalCost: { $sum: '$cost' },
          averageCost: { $avg: '$cost' }
        }
      }
    ]);

    const statusBreakdown = await this.projectModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityBreakdown = await this.projectModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      ...stats[0],
      statusBreakdown,
      priorityBreakdown
    };
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.projectModel.updateOne(
      { _id: id },
      {
        isDeleted: true,
        deletedAt: new Date()
      }
    );
    return result.modifiedCount > 0;
  }

  async bulkDelete(ids: string[]): Promise<number> {
    const result = await this.projectModel.updateMany(
      { _id: { $in: ids } },
      {
        isDeleted: true,
        deletedAt: new Date()
      }
    );
    return result.modifiedCount;
  }

  async bulkUpdateStatus(ids: string[], status: ProjectStatus): Promise<number> {
    const result = await this.projectModel.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      {
        status,
        updatedAt: new Date()
      }
    );
    return result.modifiedCount;
  }
}