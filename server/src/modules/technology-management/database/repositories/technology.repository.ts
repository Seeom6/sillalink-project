import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import { Technology, TechnologyDocument } from '../schemas/technology.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TechnologyRepository extends BaseMongoRepository<Technology> {
  constructor(
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<Technology>,
  ) {
    super(technologyModel);
  }

  async findAllWithFilters(filters: any): Promise<{
    technologies: TechnologyDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, category, status, search } = filters;
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: false };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const [technologies, total] = await Promise.all([
      this.technologyModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.technologyModel.countDocuments(query)
    ]);

    return {
      technologies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findFeatured(limit: number = 6): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({ isFeatured: true, isDeleted: false })
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async findByCategory(category: string, limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({ category, isDeleted: false })
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async findByTags(tags: string[], limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({ 
        tags: { $in: tags }, 
        isDeleted: false 
      })
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async searchTechnologies(searchTerm: string, limit: number = 10): Promise<TechnologyDocument[]> {
    return this.technologyModel
      .find({
        $and: [
          { isDeleted: false },
          {
            $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { description: { $regex: searchTerm, $options: 'i' } },
              { tags: { $in: [new RegExp(searchTerm, 'i')] } }
            ]
          }
        ]
      })
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getTechnologyStats(): Promise<any> {
    const stats = await this.technologyModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          learning: { $sum: { $cond: [{ $eq: ['$status', 'learning'] }, 1, 0] } },
          expert: { $sum: { $cond: [{ $eq: ['$status', 'expert'] }, 1, 0] } },
          featured: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          avgProficiency: { $avg: '$proficiencyLevel' }
        }
      }
    ]);
    
    return stats[0] || {
      total: 0,
      active: 0,
      learning: 0,
      expert: 0,
      featured: 0,
      avgProficiency: 0
    };
  }
}
