import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@Package/auth';
import { ProjectService } from '../../services/project.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
  BulkDeleteProjectsDto,
  BulkUpdateStatusDto,
  CreateTaskDto,
  UpdateTaskDto
} from '../dto/project.dto';
import { ProjectDocument } from '../../database/project.schema';

@Controller('admin/projects')
@UseGuards(JwtAuthGuard)
export class ProjectAdminController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    return this.projectService.create(createProjectDto);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]): Promise<{ success: boolean; imageUrls: string[]; message: string }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    const imageUrls = files.map((file, index) =>
      `uploads/projects/${Date.now()}-${index}-${file.originalname}`
    );

    return {
      success: true,
      imageUrls,
      message: `${files.length} image(s) uploaded successfully`
    };
  }

  @Get()
  async findAll(@Query() queryDto: ProjectQueryDto): Promise<{
    projects: ProjectDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.projectService.findAll(queryDto);
  }

  @Get('featured')
  async findFeatured(@Query('limit') limit?: number): Promise<ProjectDocument[]> {
    return this.projectService.findFeatured(limit);
  }

  @Get('stats')
  async getStats(): Promise<any> {
    return this.projectService.getProjectStats();
  }

  @Get('search')
  async search(
    @Query('q') searchTerm: string,
    @Query('limit') limit?: number
  ): Promise<ProjectDocument[]> {
    return this.projectService.searchProjects(searchTerm, limit);
  }

  @Get('export')
  async export(@Query() queryDto: ProjectQueryDto): Promise<ProjectDocument[]> {
    return this.projectService.exportProjects(queryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectDocument> {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ): Promise<ProjectDocument> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Put(':id/toggle-featured')
  async toggleFeatured(@Param('id') id: string): Promise<ProjectDocument> {
    return this.projectService.toggleFeatured(id);
  }

  @Post(':id/employees/:employeeId')
  async addEmployee(
    @Param('id') projectId: string,
    @Param('employeeId') employeeId: string
  ): Promise<ProjectDocument> {
    return this.projectService.addEmployee(projectId, employeeId);
  }

  @Delete(':id/employees/:employeeId')
  async removeEmployee(
    @Param('id') projectId: string,
    @Param('employeeId') employeeId: string
  ): Promise<ProjectDocument> {
    return this.projectService.removeEmployee(projectId, employeeId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    return this.projectService.remove(id);
  }

  @Post('bulk-delete')
  async bulkDelete(@Body() bulkDeleteDto: BulkDeleteProjectsDto): Promise<{
    success: boolean;
    deletedCount: number;
    message: string;
  }> {
    return this.projectService.bulkDelete(bulkDeleteDto.ids);
  }

  @Post('bulk-update-status')
  async bulkUpdateStatus(@Body() bulkUpdateDto: BulkUpdateStatusDto): Promise<{
    success: boolean;
    updatedCount: number;
    message: string;
  }> {
    return this.projectService.bulkUpdateStatus(bulkUpdateDto.ids, bulkUpdateDto.status);
  }

  // Task Management Endpoints
  @Get(':id/tasks')
  async getProjectTasks(@Param('id') projectId: string): Promise<any[]> {
    return this.projectService.getProjectTasks(projectId);
  }

  @Post(':id/tasks')
  async addTask(
    @Param('id') projectId: string,
    @Body() taskData: CreateTaskDto
  ): Promise<ProjectDocument> {
    return this.projectService.addTask(projectId, taskData);
  }

  @Put(':id/tasks/:taskIndex')
  async updateTask(
    @Param('id') projectId: string,
    @Param('taskIndex') taskIndex: string,
    @Body() taskData: UpdateTaskDto
  ): Promise<ProjectDocument> {
    const index = parseInt(taskIndex, 10);
    if (isNaN(index)) {
      throw new BadRequestException('Invalid task index');
    }
    return this.projectService.updateTask(projectId, index, taskData);
  }

  @Delete(':id/tasks/:taskIndex')
  async removeTask(
    @Param('id') projectId: string,
    @Param('taskIndex') taskIndex: string
  ): Promise<ProjectDocument> {
    const index = parseInt(taskIndex, 10);
    if (isNaN(index)) {
      throw new BadRequestException('Invalid task index');
    }
    return this.projectService.removeTask(projectId, index);
  }
}
