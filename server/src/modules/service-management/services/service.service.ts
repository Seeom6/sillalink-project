import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../database/repositories/service.repository';
import { ServiceError } from './service.error';
import { CreateServiceDto } from '../api/dto/request/create-service.dto';
import { UpdateServiceDto } from '../api/dto/request/update-service.dto';
import { GetAllServicesDto } from '../api/dto/request/get-all-services.dto';
import { ServiceDocument } from '../database/schemas/service.schema';
import { ErrorCode } from '../../../common/error/error-code';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceError: ServiceError
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceDocument> {
    // Check if service already exists
    const existingService = await this.serviceRepository.findOne({
      filter: { name: createServiceDto.name, deletedAt: null }
    });

    if (existingService) {
      this.serviceError.throw(ErrorCode.SERVICE_ALREADY_EXISTS);
    }

    // Create the service
    const service = await this.serviceRepository.create({
      doc: {
        ...createServiceDto,
        status: createServiceDto.status || 'active',
        currency: createServiceDto.currency || 'USD',
        features: createServiceDto.features || [],
        technologies: createServiceDto.technologies || [],
        tags: createServiceDto.tags || [],
        images: createServiceDto.images || [],
        isFeatured: createServiceDto.isFeatured || false,
        isActive: createServiceDto.isActive !== false,
        orderCount: 0,
        rating: 0,
        reviewCount: 0
      } as any
    });

    return service;
  }

  async findAll(filters: GetAllServicesDto): Promise<{
    services: ServiceDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.serviceRepository.findAllWithFilters(filters);
  }

  async findById(id: string): Promise<ServiceDocument> {
    const service = await this.serviceRepository.findOne({
      filter: { _id: id, deletedAt: null }
    });
    if (!service) {
      this.serviceError.throw(ErrorCode.SERVICE_NOT_FOUND);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceDocument> {
    const service = await this.findById(id);
    
    return this.serviceRepository.findOneAndUpdate({
      filter: { _id: id },
      update: updateServiceDto
    });
  }

  async delete(id: string): Promise<void> {
    const service = await this.findById(id);
    
    await this.serviceRepository.findOneAndUpdate({
      filter: { _id: id },
      update: { deletedAt: new Date() }
    });
  }

  async findFeatured(limit: number = 6): Promise<ServiceDocument[]> {
    return this.serviceRepository.findFeatured(limit);
  }

  async findByCategory(category: string, limit: number = 10): Promise<ServiceDocument[]> {
    return this.serviceRepository.findByCategory(category, limit);
  }

  async searchServices(searchTerm: string, limit: number = 10): Promise<ServiceDocument[]> {
    return this.serviceRepository.searchServices(searchTerm, limit);
  }

  async getServiceStats(): Promise<any> {
    return this.serviceRepository.getServiceStats();
  }

  async incrementOrderCount(id: string): Promise<ServiceDocument> {
    const service = await this.findById(id);
    return this.update(id, { 
      orderCount: service.orderCount + 1 
    } as any);
  }

  async updateRating(id: string, newRating: number): Promise<ServiceDocument> {
    const service = await this.findById(id);
    const totalRating = service.rating * service.reviewCount + newRating;
    const newReviewCount = service.reviewCount + 1;
    const avgRating = totalRating / newReviewCount;

    return this.update(id, { 
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
      reviewCount: newReviewCount
    } as any);
  }
}
