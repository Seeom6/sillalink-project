import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { ProjectRepository, ProjectFilters } from "../database/project.repository";
import { ProjectDocument, ProjectStatus, ProjectPriority } from "../database/project.schema";
import { EnvironmentService } from "@Package/config";
import { parsImageUrl } from "@Package/file";
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto, CreateTaskDto, UpdateTaskDto } from "../api/dto/project.dto";

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly envService: EnvironmentService
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    // Check if project with same name already exists
    const existingProject = await this.projectRepository.findByName(createProjectDto.name);
    if (existingProject) {
      throw new ConflictException('Project with this name already exists');
    }

    // Validate date logic
    if (createProjectDto.endDate && createProjectDto.startDate) {
      const startDate = new Date(createProjectDto.startDate);
      const endDate = new Date(createProjectDto.endDate);
      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Process images
    const processedImages = createProjectDto.images?.map(image => parsImageUrl(image)) || [];

    // Process tasks
    const processedTasks = createProjectDto.tasks?.map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: createProjectDto.createdBy
    })) || [];

    const projectData = {
      ...createProjectDto,
      images: processedImages,
      startDate: new Date(createProjectDto.startDate),
      endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : undefined,
      assignedEmployees: createProjectDto.assignedEmployees || [],
      technologiesUsed: createProjectDto.technologiesUsed || [],
      status: createProjectDto.status || ProjectStatus.PLANNING,
      priority: createProjectDto.priority || ProjectPriority.MEDIUM,
      isFeatured: createProjectDto.isFeatured || false,
      tasks: processedTasks,
    };

    const project = await this.projectRepository.create(projectData);
    return this.populateProject(project);
  }

  async findAll(queryDto: ProjectQueryDto): Promise<{
    projects: ProjectDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const filters: ProjectFilters = {
      search: queryDto.search,
      status: queryDto.status,
      priority: queryDto.priority,
      assignedEmployee: queryDto.assignedEmployee,
      technology: queryDto.technology,
      startDateFrom: queryDto.startDateFrom ? new Date(queryDto.startDateFrom) : undefined,
      startDateTo: queryDto.startDateTo ? new Date(queryDto.startDateTo) : undefined,
      endDateFrom: queryDto.endDateFrom ? new Date(queryDto.endDateFrom) : undefined,
      endDateTo: queryDto.endDateTo ? new Date(queryDto.endDateTo) : undefined,
      costMin: queryDto.costMin,
      costMax: queryDto.costMax,
      isFeatured: queryDto.isFeatured,
      page: queryDto.page || 1,
      limit: queryDto.limit || 10,
      sortBy: queryDto.sortBy || 'createdAt',
      sortOrder: queryDto.sortOrder || 'desc'
    };

    const result = await this.projectRepository.findAllWithFilters(filters);

    // Process images for all projects
    result.projects.forEach(project => {
      this.processProjectImages(project);
    });

    return result;
  }

  async findOne(id: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: { _id: id, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    this.processProjectImages(project);
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectDocument> {
    const existingProject = await this.projectRepository.findOne({
      filter: { _id: id, isDeleted: false }
    });
    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    // Check for name conflicts if name is being updated
    if (updateProjectDto.name && updateProjectDto.name !== existingProject.name) {
      const projectWithSameName = await this.projectRepository.findByName(updateProjectDto.name);
      if (projectWithSameName && projectWithSameName._id.toString() !== id) {
        throw new ConflictException('Project with this name already exists');
      }
    }

    // Validate date logic if dates are being updated
    const startDate = updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : existingProject.startDate;
    const endDate = updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : existingProject.endDate;

    if (endDate && startDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Process images
    const processedImages = updateProjectDto.images?.map(image => parsImageUrl(image));

    const updateData = {
      ...updateProjectDto,
      ...(processedImages && { images: processedImages }),
      ...(updateProjectDto.startDate && { startDate: new Date(updateProjectDto.startDate) }),
      ...(updateProjectDto.endDate && { endDate: new Date(updateProjectDto.endDate) }),
      updatedAt: new Date()
    };

    const updatedProject = await this.projectRepository.update(id, updateData);
    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    this.processProjectImages(updatedProject);
    return updatedProject;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const project = await this.projectRepository.findOne({
      filter: { _id: id, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.remove(id);
    return {
      success: true,
      message: 'Project deleted successfully'
    };
  }

  async findFeatured(limit: number = 6): Promise<ProjectDocument[]> {
    const projects = await this.projectRepository.findFeatured(limit);
    projects.forEach(project => {
      this.processProjectImages(project);
    });
    return projects;
  }

  async findByStatus(status: ProjectStatus, limit: number = 10): Promise<ProjectDocument[]> {
    const projects = await this.projectRepository.findByStatus(status, limit);
    projects.forEach(project => {
      this.processProjectImages(project);
    });
    return projects;
  }

  async findByEmployee(employeeId: string, limit: number = 10): Promise<ProjectDocument[]> {
    const projects = await this.projectRepository.findByEmployee(employeeId, limit);
    projects.forEach(project => {
      this.processProjectImages(project);
    });
    return projects;
  }

  async findByTechnology(technologyId: string, limit: number = 10): Promise<ProjectDocument[]> {
    const projects = await this.projectRepository.findByTechnology(technologyId, limit);
    projects.forEach(project => {
      this.processProjectImages(project);
    });
    return projects;
  }

  private processProjectImages(project: ProjectDocument): void {
    if (project.images && project.images.length > 0) {
      project.images = project.images.map(image => parsImageUrl(image));
    }
    if (project.mainImage) {
      project.mainImage = parsImageUrl(project.mainImage);
    }
  }

  private async populateProject(project: ProjectDocument): Promise<ProjectDocument> {
    return this.projectRepository.findOne({
      filter: { _id: project._id }
    });
  }

  async searchProjects(searchTerm: string, limit: number = 10): Promise<ProjectDocument[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new BadRequestException('Search term is required');
    }

    const projects = await this.projectRepository.searchProjects(searchTerm.trim(), limit);
    projects.forEach(project => {
      this.processProjectImages(project);
    });
    return projects;
  }

  async getProjectStats(): Promise<any> {
    const stats = await this.projectRepository.getProjectStats();
    return {
      ...stats,
      totalCost: stats.totalCost || 0,
      averageCost: stats.averageCost || 0,
      statusBreakdown: stats.statusBreakdown || [],
      priorityBreakdown: stats.priorityBreakdown || []
    };
  }

  async toggleFeatured(id: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: { _id: id, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const updatedProject = await this.projectRepository.update(id, {
      isFeatured: !project.isFeatured,
      updatedAt: new Date()
    });

    this.processProjectImages(updatedProject);
    return updatedProject;
  }

  async addEmployee(projectId: string, employeeId: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: { _id: projectId, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.assignedEmployees.includes(employeeId as any)) {
      throw new ConflictException('Employee is already assigned to this project');
    }

    const updatedProject = await this.projectRepository.addMember(projectId, employeeId);
    this.processProjectImages(updatedProject);
    return updatedProject;
  }

  async removeEmployee(projectId: string, employeeId: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: { _id: projectId, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project.assignedEmployees.includes(employeeId as any)) {
      throw new BadRequestException('Employee is not assigned to this project');
    }

    const updatedProject = await this.projectRepository.removeMember(projectId, employeeId);
    this.processProjectImages(updatedProject);
    return updatedProject;
  }

  async bulkDelete(ids: string[]): Promise<{ success: boolean; deletedCount: number; message: string }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Project IDs are required');
    }

    // Validate that all projects exist and are not already deleted
    const projects = await Promise.all(
      ids.map(id => this.projectRepository.findOne({
        filter: { _id: id, isDeleted: false }
      }))
    );

    const validProjects = projects.filter(project => project);
    if (validProjects.length === 0) {
      throw new NotFoundException('No valid projects found to delete');
    }

    const deletedCount = await this.projectRepository.bulkDelete(ids);

    return {
      success: true,
      deletedCount,
      message: `${deletedCount} project(s) deleted successfully`
    };
  }

  async bulkUpdateStatus(ids: string[], status: ProjectStatus): Promise<{
    success: boolean;
    updatedCount: number;
    message: string
  }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Project IDs are required');
    }

    // Validate that all projects exist and are not deleted
    const projects = await Promise.all(
      ids.map(id => this.projectRepository.findOne({
        filter: { _id: id, isDeleted: false }
      }))
    );

    const validProjects = projects.filter(project => project);
    if (validProjects.length === 0) {
      throw new NotFoundException('No valid projects found to update');
    }

    const updatedCount = await this.projectRepository.bulkUpdateStatus(ids, status);

    return {
      success: true,
      updatedCount,
      message: `${updatedCount} project(s) status updated to ${status} successfully`
    };
  }

  async exportProjects(queryDto: ProjectQueryDto): Promise<ProjectDocument[]> {
    const filters: ProjectFilters = {
      search: queryDto.search,
      status: queryDto.status,
      priority: queryDto.priority,
      assignedEmployee: queryDto.assignedEmployee,
      technology: queryDto.technology,
      startDateFrom: queryDto.startDateFrom ? new Date(queryDto.startDateFrom) : undefined,
      startDateTo: queryDto.startDateTo ? new Date(queryDto.startDateTo) : undefined,
      endDateFrom: queryDto.endDateFrom ? new Date(queryDto.endDateFrom) : undefined,
      endDateTo: queryDto.endDateTo ? new Date(queryDto.endDateTo) : undefined,
      costMin: queryDto.costMin,
      costMax: queryDto.costMax,
      isFeatured: queryDto.isFeatured,
      page: 1,
      limit: 10000, // Large limit for export
      sortBy: queryDto.sortBy || 'createdAt',
      sortOrder: queryDto.sortOrder || 'desc'
    };

    const result = await this.projectRepository.findAllWithFilters(filters);

    // Process images for all projects
    result.projects.forEach(project => {
      this.processProjectImages(project);
    });

    return result.projects;
  }

  async addTask(projectId: string, taskData: CreateTaskDto): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: { _id: projectId, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const newTask = {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProject = await this.projectRepository.update(projectId, {
      $push: { tasks: newTask }
    });

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    this.processProjectImages(updatedProject);
    return updatedProject;
  }

  async updateTask(projectId: string, taskIndex: number, taskData: UpdateTaskDto): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: { _id: projectId, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (taskIndex < 0 || taskIndex >= project.tasks.length) {
      throw new BadRequestException('Invalid task index');
    }

    const updateFields: any = {};
    Object.keys(taskData).forEach(key => {
      if (taskData[key] !== undefined) {
        if (key === 'dueDate' && taskData[key]) {
          updateFields[`tasks.${taskIndex}.${key}`] = new Date(taskData[key]);
        } else {
          updateFields[`tasks.${taskIndex}.${key}`] = taskData[key];
        }
      }
    });
    updateFields[`tasks.${taskIndex}.updatedAt`] = new Date();

    const updatedProject = await this.projectRepository.update(projectId, updateFields);
    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    this.processProjectImages(updatedProject);
    return updatedProject;
  }

  async removeTask(projectId: string, taskIndex: number): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: { _id: projectId, isDeleted: false }
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (taskIndex < 0 || taskIndex >= project.tasks.length) {
      throw new BadRequestException('Invalid task index');
    }

    project.tasks.splice(taskIndex, 1);

    const updatedProject = await this.projectRepository.update(projectId, {
      tasks: project.tasks
    });

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    this.processProjectImages(updatedProject);
    return updatedProject;
  }

  async getProjectTasks(projectId: string): Promise<any[]> {
    const project = await this.projectRepository.findOne({
      filter: { _id: projectId, isDeleted: false }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project.tasks || [];
  }

  // Legacy method for backward compatibility
  async getAll(): Promise<ProjectDocument[]> {
    const projects = await this.findFeatured(6);
    return projects;
  }
}

// Keep the legacy service for backward compatibility
@Injectable()
export class ProjectServiceWeb extends ProjectService {
  constructor(
    projectRepository: ProjectRepository,
    envService: EnvironmentService
  ) {
    super(projectRepository, envService);
  }
}