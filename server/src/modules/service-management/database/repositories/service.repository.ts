import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ServiceRepository extends BaseMongoRepository<Service> {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<Service>,
  ) {
    super(serviceModel);
  }

  async findAllWithFilters(filters: any): Promise<{
    services: ServiceDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, category, status, search } = filters;
    const skip = (page - 1) * limit;

    const query: any = { deletedAt: null };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const [services, total] = await Promise.all([
      this.serviceModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.serviceModel.countDocuments(query)
    ]);

    return {
      services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findFeatured(limit: number = 6): Promise<ServiceDocument[]> {
    return this.serviceModel
      .find({ isFeatured: true, deletedAt: null })
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async findByCategory(category: string, limit: number = 10): Promise<ServiceDocument[]> {
    return this.serviceModel
      .find({ category, deletedAt: null })
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async searchServices(searchTerm: string, limit: number = 10): Promise<ServiceDocument[]> {
    return this.serviceModel
      .find({
        $and: [
          { deletedAt: null },
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

  async getServiceStats(): Promise<any> {
    const stats = await this.serviceModel.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
          featured: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          totalOrders: { $sum: '$orderCount' },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);
    
    return stats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      featured: 0,
      totalOrders: 0,
      avgRating: 0
    };
  }
}
