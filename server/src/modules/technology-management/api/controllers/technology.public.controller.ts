import { Controller, Get, Param, Query } from '@nestjs/common';
import { TechnologyService } from '../../services/technology.service';
import { GetAllTechnologiesDto } from '../dto/request/get-all-technologies.dto';
import { TechnologyStatus } from '../../database/schemas/technology.schema';

@Controller('public/technologies')
export class TechnologyPublicController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  async findAll(@Query() filters: GetAllTechnologiesDto) {
    // Only return active technologies for public API
    const publicFilters = {
      ...filters,
      status: TechnologyStatus.ACTIVE,
      // Limit results for public API
      limit: Math.min(filters.limit || 10, 50)
    };

    return this.technologyService.findAll(publicFilters);
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit: number = 6) {
    // Limit featured technologies for public API
    const safeLimit = Math.min(limit, 12);
    return this.technologyService.findFeatured(safeLimit);
  }

  @Get('categories')
  async getCategories() {
    return this.technologyService.getCategories();
  }

  @Get('by-category/:category')
  async getByCategory(
    @Param('category') category: string, 
    @Query('limit') limit: number = 10
  ) {
    const safeLimit = Math.min(limit, 20);
    return this.technologyService.findByCategory(category, safeLimit);
  }

  @Get('search')
  async search(
    @Query('q') searchTerm: string, 
    @Query('limit') limit: number = 10
  ) {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }
    
    const safeLimit = Math.min(limit, 20);
    return this.technologyService.searchTechnologies(searchTerm, safeLimit);
  }

  @Get('stats')
  async getStats() {
    const stats = await this.technologyService.getTechnologyStats();
    
    // Return only public-safe statistics
    return {
      total: stats.total,
      featured: stats.featured,
      byCategory: stats.byCategory || {},
      byDifficulty: stats.byDifficulty || {}
    };
  }

  @Get('tags')
  async getTags() {
    return this.technologyService.getAllTags();
  }
}
