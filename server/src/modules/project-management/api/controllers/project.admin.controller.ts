import { Body, Get, Post, Put, Delete, Param, Query, Patch } from '@nestjs/common';
import { AuthControllerAdmin } from 'src/package/api';
import { ProjectService } from '../../services/project.service';
import { CreateProjectDto } from '../dto/request/create-project.dto';
import { UpdateProjectDto } from '../dto/request/update-project.dto';
import { GetAllProjectsDto } from '../dto/request/get-all-projects.dto';
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '../../../user-management/interfaces/user-role.enum';

@AuthControllerAdmin({
  prefix: 'projects'
})
export class ProjectAdminController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAll(@Query() filters: GetAllProjectsDto) {
    return this.projectService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findById(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.projectService.delete(id);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getStats() {
    return this.projectService.getProjectStats();
  }

  @Post(':id/members')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async addMember(@Param('id') id: string, @Body() body: { userId: string; role: string }) {
    return this.projectService.addMember(id, body.userId, body.role);
  }

  @Delete(':id/members/:userId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectService.removeMember(id, userId);
  }

  @Post(':id/tasks')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async addTask(@Param('id') id: string, @Body() task: any) {
    return this.projectService.addTask(id, task);
  }

  @Patch(':id/tasks/:taskIndex')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateTask(@Param('id') id: string, @Param('taskIndex') taskIndex: number, @Body() taskUpdate: any) {
    return this.projectService.updateTask(id, taskIndex, taskUpdate);
  }

  @Get('manager/:managerId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByManager(@Param('managerId') managerId: string) {
    return this.projectService.findByManager(managerId);
  }

  @Get('member/:userId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByMember(@Param('userId') userId: string) {
    return this.projectService.findByMember(userId);
  }

  @Get('status/:status')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByStatus(@Param('status') status: string) {
    return this.projectService.findByStatus(status);
  }
}
