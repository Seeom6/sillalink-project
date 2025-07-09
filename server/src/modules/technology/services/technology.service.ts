import { Injectable } from '@nestjs/common';
import { TechnologyRepository } from '../database/technology.repository';
import { TechnologyError } from './technology.error';
import { CreateTechnologyDto } from '../api/dto/request/create-technology.dto';
import { UpdateTechnologyDto } from '../api/dto/request/update-technology.dto';
import { GetAllTechnologiesDto } from '../api/dto/request/get-all-technologies.dto';
import { TechnologyDocument } from '../database/technology.schema';
import { ErrorCode } from '../../../common/error/error-code';

@Injectable()
export class TechnologyService {
  constructor(
    private readonly technologyRepository: TechnologyRepository,
    private readonly technologyError: TechnologyError
  ) {}

  async create(createTechnologyDto: CreateTechnologyDto): Promise<TechnologyDocument> {
    // Check if technology with same name already exists
    const existingTechnology = await this.technologyRepository.findByName(createTechnologyDto.name);
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
    return this.technologyRepository.findAllWithFilters(filters);
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
    // Check if technology exists
    const existingTechnology = await this.findById(id);

    // Check if name is being updated and if it conflicts with another technology
    if (updateTechnologyDto.name && updateTechnologyDto.name !== existingTechnology.name) {
      const technologyWithSameName = await this.technologyRepository.findByName(updateTechnologyDto.name);
      if (technologyWithSameName && technologyWithSameName._id.toString() !== id) {
        this.technologyError.throw(ErrorCode.TECHNOLOGY_ALREADY_EXISTS);
      }
    }

    // Update the technology
    const updatedTechnology = await this.technologyRepository.findOneAndUpdate({
      filter: { _id: id, isDeleted: false },
      update: {
        ...updateTechnologyDto,
        updatedAt: new Date()
      }
    });

    if (!updatedTechnology) {
      this.technologyError.throw(ErrorCode.TECHNOLOGY_NOT_FOUND);
    }

    return updatedTechnology;
  }

  async delete(id: string): Promise<void> {
    const technology = await this.findById(id);
    await this.technologyRepository.softDelete(id);
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

  async bulkDelete(ids: string[]): Promise<void> {
    // Validate that all technologies exist
    const technologies = await Promise.all(
      ids.map(id => this.technologyRepository.findOne({
        filter: { _id: id, isDeleted: false }
      }))
    );

    const notFoundIds = ids.filter((id, index) => !technologies[index]);
    if (notFoundIds.length > 0) {
      this.technologyError.throw(ErrorCode.TECHNOLOGY_NOT_FOUND);
    }

    await this.technologyRepository.bulkDelete(ids);
  }

  async bulkUpdate(ids: string[], updates: any): Promise<void> {
    // Validate that all technologies exist
    const technologies = await Promise.all(
      ids.map(id => this.technologyRepository.findOne({
        filter: { _id: id, isDeleted: false }
      }))
    );

    const notFoundIds = ids.filter((id, index) => !technologies[index]);
    if (notFoundIds.length > 0) {
      this.technologyError.throw(ErrorCode.TECHNOLOGY_NOT_FOUND);
    }

    await this.technologyRepository.bulkUpdate(ids, updates);
  }

  async toggleFeatured(id: string): Promise<TechnologyDocument> {
    const technology = await this.findById(id);
    return this.update(id, { 
      id,
      isFeatured: !technology.isFeatured 
    });
  }

  async updateProficiencyLevel(id: string, proficiencyLevel: number): Promise<TechnologyDocument> {
    if (proficiencyLevel < 0 || proficiencyLevel > 100) {
      this.technologyError.throw(ErrorCode.INVALID_PROFICIENCY_LEVEL);
    }

    return this.update(id, { 
      id,
      proficiencyLevel 
    });
  }

  async incrementProjectUsage(id: string): Promise<TechnologyDocument> {
    const technology = await this.findById(id);
    return this.update(id, { 
      id,
      projectsUsedIn: technology.projectsUsedIn + 1,
      lastUsed: new Date()
    });
  }

  async decrementProjectUsage(id: string): Promise<TechnologyDocument> {
    const technology = await this.findById(id);
    const newCount = Math.max(0, technology.projectsUsedIn - 1);
    
    return this.update(id, { 
      id,
      projectsUsedIn: newCount
    });
  }
}
