import { Get, Param, Query } from '@nestjs/common';
import { ControllerWeb } from 'src/package/api';
import { ServiceService } from '../../services/service.service';

@ControllerWeb({
  prefix: 'services'
})
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('featured')
  async getFeatured(@Query('limit') limit?: number) {
    return this.serviceService.findFeatured(limit || 6);
  }

  @Get('search')
  async search(@Query('q') searchTerm: string, @Query('limit') limit?: number) {
    return this.serviceService.searchServices(searchTerm, limit || 10);
  }

  @Get('category/:category')
  async getByCategory(@Param('category') category: string, @Query('limit') limit?: number) {
    return this.serviceService.findByCategory(category, limit || 10);
  }

  @Get('public')
  async getPublicServices() {
    // Return only basic public information
    const result = await this.serviceService.findAll({});
    return result.services.map(service => ({
      id: service._id,
      name: service.name,
      description: service.description,
      category: service.category,
      image: service.image,
      icon: service.icon,
      price: service.price,
      currency: service.currency,
      pricingModel: service.pricingModel,
      features: service.features,
      technologies: service.technologies,
      estimatedDuration: service.estimatedDuration,
      tags: service.tags,
      rating: service.rating,
      reviewCount: service.reviewCount
    }));
  }

  @Get(':id/public')
  async getPublicService(@Param('id') id: string) {
    const service = await this.serviceService.findById(id);
    return {
      id: service._id,
      name: service.name,
      description: service.description,
      longDescription: service.longDescription,
      category: service.category,
      image: service.image,
      images: service.images,
      icon: service.icon,
      price: service.price,
      currency: service.currency,
      pricingModel: service.pricingModel,
      features: service.features,
      technologies: service.technologies,
      estimatedDuration: service.estimatedDuration,
      deliverables: service.deliverables,
      tags: service.tags,
      rating: service.rating,
      reviewCount: service.reviewCount,
      contactEmail: service.contactEmail,
      contactPhone: service.contactPhone,
      externalLink: service.externalLink
    };
  }
}
