import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoRepository } from '@Package/database';
import { Technology, TechnologyDocument } from './technology.schema';
import { GetAllTechnologiesDto } from '../api/dto/request/get-all-technologies.dto';

@Injectable()
export class TechnologyRepository extends BaseMongoRepository<TechnologyDocument> {
  constructor(
    @InjectModel(Technology.name) private technologyModel: Model<TechnologyDocument>
  ) {
    super(technologyModel);
  }

  async findByName(name: string): Promise<TechnologyDocument | null> {
    return this.technologyModel.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isDeleted: false 
    }).exec();
  }

  async findAllWithFilters(filters: GetAllTechnologiesDto): Promise<{
    technologies: TechnologyDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      category,
      status,
      difficultyLevel,
      isFeatured,
      tags,
      proficiencyLevel,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    // Build filter query
    const query: any = { isDeleted: false };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (difficultyLevel) {
      query.difficultyLevel = difficultyLevel;
    }

    if (typeof isFeatured === 'boolean') {
      query.isFeatured = isFeatured;
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (proficiencyLevel) {
      if (proficiencyLevel.min !== undefined || proficiencyLevel.max !== undefined) {
        query.proficiencyLevel = {};
        if (proficiencyLevel.min !== undefined) {
          query.proficiencyLevel.$gte = proficiencyLevel.min;
        }
        if (proficiencyLevel.max !== undefined) {
          query.proficiencyLevel.$lte = proficiencyLevel.max;
        }
      }
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [technologies, total] = await Promise.all([
      this.technologyModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.technologyModel.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      technologies,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findFeatured(limit: number = 6): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({ 
        isFeatured: true, 
        isDeleted: false,
        status: 'active'
      })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByCategory(category: string, limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({ 
        category, 
        isDeleted: false,
        status: 'active'
      })
      .sort({ name: 1 })
      .limit(limit)
      .exec();
  }

  async findByTags(tags: string[], limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({ 
        tags: { $in: tags },
        isDeleted: false,
        status: 'active'
      })
      .sort({ proficiencyLevel: -1 })
      .limit(limit)
      .exec();
  }

  async searchTechnologies(searchTerm: string, limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({
        $text: { $search: searchTerm },
        isDeleted: false
      })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .exec();
  }

  async getTechnologyStats(): Promise<any> {
    const stats = await this.technologyModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalTechnologies: { $sum: 1 },
          averageProficiencyLevel: { $avg: '$proficiencyLevel' },
          totalLearningHours: { $sum: '$estimatedLearningHours' },
          featuredCount: {
            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
          },
          byCategory: {
            $push: {
              category: '$category',
              count: 1
            }
          },
          byStatus: {
            $push: {
              status: '$status',
              count: 1
            }
          },
          byDifficultyLevel: {
            $push: {
              difficultyLevel: '$difficultyLevel',
              count: 1
            }
          }
        }
      }
    ]);

    return stats[0] || {
      totalTechnologies: 0,
      averageProficiencyLevel: 0,
      totalLearningHours: 0,
      featuredCount: 0,
      byCategory: [],
      byStatus: [],
      byDifficultyLevel: []
    };
  }

  async softDelete(id: string): Promise<TechnologyDocument | null> {
    return this.technologyModel.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async bulkDelete(ids: string[]): Promise<any> {
    return this.technologyModel.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, updatedAt: new Date() }
    ).exec();
  }

  async bulkUpdate(ids: string[], updates: any): Promise<any> {
    return this.technologyModel.updateMany(
      { _id: { $in: ids } },
      { ...updates, updatedAt: new Date() }
    ).exec();
  }
}
