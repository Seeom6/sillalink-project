import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pagination } from 'src/package/api';

@Injectable()
export class ProjectRepository extends BaseMongoRepository<Project> {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {
    super(projectModel);
  }

  async findAllProjects(pagination?: Pagination): Promise<ProjectDocument[]> {
    const { skip = 1, limit = 10 } = pagination || {};
    return this.projectModel
      .find({ isDeleted: false })
      .populate('projectManager', 'firstName lastName email')
      .populate('members.userId', 'firstName lastName email')
      .populate('technologies', 'name icon')
      .skip((skip - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findProjectById(id: string): Promise<ProjectDocument> {
    return this.projectModel
      .findOne({ _id: id, isDeleted: false })
      .populate('projectManager', 'firstName lastName email')
      .populate('members.userId', 'firstName lastName email')
      .populate('technologies', 'name icon')
      .populate('tasks.assignee', 'firstName lastName email');
  }

  async findProjectsByManager(managerId: string): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ 
        projectManager: new Types.ObjectId(managerId), 
        isDeleted: false 
      })
      .populate('technologies', 'name icon');
  }

  async findProjectsByMember(userId: string): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ 
        'members.userId': new Types.ObjectId(userId), 
        isDeleted: false 
      })
      .populate('projectManager', 'firstName lastName email')
      .populate('technologies', 'name icon');
  }

  async findProjectsByStatus(status: string): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ status, isDeleted: false })
      .populate('projectManager', 'firstName lastName email')
      .populate('technologies', 'name icon');
  }

  async findFeaturedProjects(limit: number = 6): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ isFeatured: true, isDeleted: false })
      .populate('technologies', 'name icon')
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async searchProjects(searchTerm: string, limit: number = 10): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({
        $and: [
          { isDeleted: false },
          {
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { description: { $regex: searchTerm, $options: 'i' } },
              { tags: { $in: [new RegExp(searchTerm, 'i')] } }
            ]
          }
        ]
      })
      .populate('technologies', 'name icon')
      .limit(limit);
  }

  async updateProject(id: string, updateData: Partial<Project>): Promise<ProjectDocument> {
    return this.projectModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('projectManager', 'firstName lastName email')
      .populate('members.userId', 'firstName lastName email')
      .populate('technologies', 'name icon');
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectModel.findByIdAndUpdate(id, { 
      isDeleted: true, 
      deletedAt: new Date() 
    });
  }

  async addMemberToProject(projectId: string, userId: string, role: string): Promise<ProjectDocument> {
    return this.projectModel.findByIdAndUpdate(
      projectId,
      {
        $push: {
          members: {
            userId: new Types.ObjectId(userId),
            role,
            joinedAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('members.userId', 'firstName lastName email');
  }

  async removeMemberFromProject(projectId: string, userId: string): Promise<ProjectDocument> {
    return this.projectModel.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          members: { userId: new Types.ObjectId(userId) }
        }
      },
      { new: true }
    );
  }

  async addTaskToProject(projectId: string, task: any): Promise<ProjectDocument> {
    return this.projectModel.findByIdAndUpdate(
      projectId,
      {
        $push: { tasks: task }
      },
      { new: true }
    );
  }

  async updateProjectTask(projectId: string, taskIndex: number, taskUpdate: any): Promise<ProjectDocument> {
    const updateQuery: any = {};
    Object.keys(taskUpdate).forEach(key => {
      updateQuery[`tasks.${taskIndex}.${key}`] = taskUpdate[key];
    });

    return this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: updateQuery },
      { new: true }
    );
  }

  async getProjectStats(): Promise<any> {
    const stats = await this.projectModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          planning: { $sum: { $cond: [{ $eq: ['$status', 'planning'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          onHold: { $sum: { $cond: [{ $eq: ['$status', 'on_hold'] }, 1, 0] } },
          featured: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          avgProgress: { $avg: '$progress' }
        }
      }
    ]);
    
    return stats[0] || {
      total: 0,
      planning: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0,
      featured: 0,
      avgProgress: 0
    };
  }
}
