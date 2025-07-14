import { Injectable } from '@nestjs/common';
import { TechnologyRepository } from '../database/repositories/technology.repository';
import { TechnologyError } from './technology.error';
import { CreateTechnologyDto } from '../api/dto/request/create-technology.dto';
import { UpdateTechnologyDto } from '../api/dto/request/update-technology.dto';
import { GetAllTechnologiesDto } from '../api/dto/request/get-all-technologies.dto';
import { TechnologyDocument, TechnologyCategory, TechnologyStatus } from '../database/schemas/technology.schema';
import { ErrorCode } from '../../../common/error/error-code';

@Injectable()
export class TechnologyService {
  constructor(
    private readonly technologyRepository: TechnologyRepository,
    private readonly technologyError: TechnologyError
  ) {}

  async create(createTechnologyDto: CreateTechnologyDto): Promise<TechnologyDocument> {
    // Check if technology already exists
    const existingTechnology = await this.technologyRepository.findOne({
      filter: { name: createTechnologyDto.name, isDeleted: false }
    });

    if (existingTechnology) {
      this.technologyError.throw(ErrorCode.TECHNOLOGY_ALREADY_EXISTS);
    }

    // Create the technology
    const technology = await this.technologyRepository.create({
      doc: {
        ...createTechnologyDto,
        status: createTechnologyDto.status || 'active',
        difficultyLevel: createTechnologyDto.difficultyLevel || 'beginner',
        proficiencyLevel: createTechnologyDto.proficiencyLevel || 0,
        estimatedLearningHours: createTechnologyDto.estimatedLearningHours || 0,
        projectsUsedIn: createTechnologyDto.projectsUsedIn || 0,
        tags: createTechnologyDto.tags || [],
        relatedTechnologies: createTechnologyDto.relatedTechnologies || [],
        prerequisites: createTechnologyDto.prerequisites || [],
        learningResources: createTechnologyDto.learningResources || [],
        images: createTechnologyDto.images || [],
        isFeatured: createTechnologyDto.isFeatured || false,
        isDeleted: false,
        icon: createTechnologyDto.icon || '',
        image: createTechnologyDto.image || ''
      } as any
    });

    return technology;
  }

  async findAll(filters: GetAllTechnologiesDto): Promise<{
    technologies: TechnologyDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.technologyRepository.findAllWithFiltersEnhanced(filters);
  }

  async findById(id: string): Promise<TechnologyDocument> {
    const technology = await this.technologyRepository.findOne({
      filter: { _id: id, isDeleted: false }
    });
    if (!technology) {
      this.technologyError.throw(ErrorCode.TECHNOLOGY_NOT_FOUND);
    }
    return technology;
  }

  async update(id: string, updateTechnologyDto: UpdateTechnologyDto): Promise<TechnologyDocument> {
    const technology = await this.findById(id);
    
    return this.technologyRepository.findOneAndUpdate({
      filter: { _id: id },
      update: updateTechnologyDto
    });
  }

  async delete(id: string): Promise<void> {
    const technology = await this.findById(id);
    
    await this.technologyRepository.findOneAndUpdate({
      filter: { _id: id },
      update: { isDeleted: true, deletedAt: new Date() }
    });
  }

  async findFeatured(limit: number = 6): Promise<TechnologyDocument[]> {
    return this.technologyRepository.findFeatured(limit);
  }

  async findByCategory(category: string, limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyRepository.findByCategory(category, limit);
  }

  async findByTags(tags: string[], limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyRepository.findByTags(tags, limit);
  }

  async searchTechnologies(searchTerm: string, limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyRepository.searchTechnologies(searchTerm, limit);
  }

  async getTechnologyStats(): Promise<any> {
    return this.technologyRepository.getTechnologyStats();
  }

  async updateProficiencyLevel(id: string, proficiencyLevel: number): Promise<TechnologyDocument> {
    if (proficiencyLevel < 0 || proficiencyLevel > 100) {
      this.technologyError.throw(ErrorCode.INVALID_PROFICIENCY_LEVEL);
    }

    return this.update(id, { 
      proficiencyLevel 
    } as any);
  }

  async incrementProjectUsage(id: string): Promise<TechnologyDocument> {
    const technology = await this.findById(id);
    return this.update(id, { 
      projectsUsedIn: technology.projectsUsedIn + 1,
      lastUsed: new Date()
    } as any);
  }

  async decrementProjectUsage(id: string): Promise<TechnologyDocument> {
    const technology = await this.findById(id);
    const newCount = Math.max(0, technology.projectsUsedIn - 1);

    return this.update(id, {
      projectsUsedIn: newCount
    } as any);
  }

  async getCategories(): Promise<{ value: string; label: string }[]> {
    return Object.values(TechnologyCategory).map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')
    }));
  }

  async getStatuses(): Promise<{ value: string; label: string }[]> {
    return Object.values(TechnologyStatus).map(status => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1)
    }));
  }

  async getAllTags(): Promise<string[]> {
    return this.technologyRepository.getAllTags();
  }

  async bulkUpdateStatus(ids: string[], status: TechnologyStatus): Promise<void> {
    await this.technologyRepository.bulkUpdateStatus(ids, status);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.technologyRepository.bulkDelete(ids);
  }

  async duplicateTechnology(id: string, newName: string): Promise<TechnologyDocument> {
    const originalTechnology = await this.findById(id);

    // Check if new name already exists
    const existingTechnology = await this.technologyRepository.findOne({
      filter: { name: newName, isDeleted: false }
    });

    if (existingTechnology) {
      this.technologyError.throw(ErrorCode.TECHNOLOGY_ALREADY_EXISTS);
    }

    // Create duplicate with new name
    const duplicateData = {
      ...originalTechnology.toObject(),
      name: newName,
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      isFeatured: false, // Reset featured status for duplicates
      projectsUsedIn: 0, // Reset project usage count
      lastUsed: undefined // Reset last used date
    };

    return this.technologyRepository.create({ doc: duplicateData });
  }
}
