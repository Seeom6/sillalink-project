import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../database/repositories/project.repository';
import { ProjectError } from './project.error';
import { CreateProjectDto } from '../api/dto/request/create-project.dto';
import { UpdateProjectDto } from '../api/dto/request/update-project.dto';
import { GetAllProjectsDto } from '../api/dto/request/get-all-projects.dto';
import { ProjectDocument } from '../database/schemas/project.schema';
import { ErrorCode } from '../../../common/error/error-code';
import { Types } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectError: ProjectError
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    // Check if project already exists
    const existingProject = await this.projectRepository.findOne({
      filter: { name: createProjectDto.name, isDeleted: false }
    });

    if (existingProject) {
      this.projectError.throw(ErrorCode.PROJECT_ALREADY_EXISTS);
    }

    // Create the project
    const projectData = {
      ...createProjectDto,
      projectManager: new Types.ObjectId(createProjectDto.projectManager),
      members: createProjectDto.members?.map(member => ({
        userId: new Types.ObjectId(member.userId),
        role: member.role,
        joinedAt: new Date()
      })) || [],
      technologies: createProjectDto.technologies?.map(id => new Types.ObjectId(id)) || [],
      tasks: createProjectDto.tasks || [],
      isDeleted: false
    };

    const project = await this.projectRepository.create({
      doc: projectData as any
    });

    return project;
  }

  async findAll(filters: GetAllProjectsDto): Promise<ProjectDocument[]> {
    return this.projectRepository.findAllProjects(filters as any);
  }

  async findById(id: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findProjectById(id);
    if (!project) {
      this.projectError.throw(ErrorCode.PROJECT_NOT_FOUND);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectDocument> {
    const project = await this.findById(id);
    
    const updateData = { ...updateProjectDto };
    if (updateProjectDto.projectManager) {
      updateData.projectManager = new Types.ObjectId(updateProjectDto.projectManager) as any;
    }
    if (updateProjectDto.technologies) {
      updateData.technologies = updateProjectDto.technologies.map(id => new Types.ObjectId(id)) as any;
    }

    return this.projectRepository.updateProject(id, updateData as any);
  }

  async delete(id: string): Promise<void> {
    const project = await this.findById(id);
    await this.projectRepository.deleteProject(id);
  }

  async findByManager(managerId: string): Promise<ProjectDocument[]> {
    return this.projectRepository.findProjectsByManager(managerId);
  }

  async findByMember(userId: string): Promise<ProjectDocument[]> {
    return this.projectRepository.findProjectsByMember(userId);
  }

  async findByStatus(status: string): Promise<ProjectDocument[]> {
    return this.projectRepository.findProjectsByStatus(status);
  }

  async findFeatured(limit: number = 6): Promise<ProjectDocument[]> {
    return this.projectRepository.findFeaturedProjects(limit);
  }

  async searchProjects(searchTerm: string, limit: number = 10): Promise<ProjectDocument[]> {
    return this.projectRepository.searchProjects(searchTerm, limit);
  }

  async addMember(projectId: string, userId: string, role: string): Promise<ProjectDocument> {
    const project = await this.findById(projectId);
    
    // Check if user is already a member
    const existingMember = project.members.find(member => 
      member.userId.toString() === userId
    );
    
    if (existingMember) {
      this.projectError.throw(ErrorCode.MEMBER_ALREADY_EXISTS);
    }

    return this.projectRepository.addMemberToProject(projectId, userId, role);
  }

  async removeMember(projectId: string, userId: string): Promise<ProjectDocument> {
    const project = await this.findById(projectId);
    
    const memberExists = project.members.find(member => 
      member.userId.toString() === userId
    );
    
    if (!memberExists) {
      this.projectError.throw(ErrorCode.MEMBER_NOT_FOUND);
    }

    return this.projectRepository.removeMemberFromProject(projectId, userId);
  }

  async addTask(projectId: string, task: any): Promise<ProjectDocument> {
    const project = await this.findById(projectId);
    
    const taskData = {
      ...task,
      assignee: task.assignee ? new Types.ObjectId(task.assignee) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.projectRepository.addTaskToProject(projectId, taskData);
  }

  async updateTask(projectId: string, taskIndex: number, taskUpdate: any): Promise<ProjectDocument> {
    const project = await this.findById(projectId);
    
    if (taskIndex >= project.tasks.length) {
      throw new Error('Task not found');
    }

    const updateData = {
      ...taskUpdate,
      updatedAt: new Date()
    };

    if (taskUpdate.assignee) {
      updateData.assignee = new Types.ObjectId(taskUpdate.assignee);
    }

    return this.projectRepository.updateProjectTask(projectId, taskIndex, updateData);
  }

  async getProjectStats(): Promise<any> {
    return this.projectRepository.getProjectStats();
  }
}
