import { Get, Param, Query } from '@nestjs/common';
import { ControllerWeb } from 'src/package/api';
import { ProjectService } from '../../services/project.service';

@ControllerWeb({
  prefix: 'projects'
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('featured')
  async getFeatured(@Query('limit') limit?: number) {
    return this.projectService.findFeatured(limit || 6);
  }

  @Get('search')
  async search(@Query('q') searchTerm: string, @Query('limit') limit?: number) {
    return this.projectService.searchProjects(searchTerm, limit || 10);
  }

  @Get('public')
  async getPublicProjects() {
    // Return only basic public information
    const projects = await this.projectService.findAll({});
    return projects.map(project => ({
      id: project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      mainImage: project.mainImage,
      technologies: project.technologies,
      tags: project.tags,
      liveUrl: project.liveUrl,
      repositoryUrl: project.repositoryUrl
    }));
  }

  @Get(':id/public')
  async getPublicProject(@Param('id') id: string) {
    const project = await this.projectService.findById(id);
    return {
      id: project._id,
      name: project.name,
      description: project.description,
      longDescription: project.longDescription,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      progress: project.progress,
      technologies: project.technologies,
      tags: project.tags,
      mainImage: project.mainImage,
      images: project.images,
      liveUrl: project.liveUrl,
      repositoryUrl: project.repositoryUrl,
      externalLink: project.externalLink
    };
  }
}
