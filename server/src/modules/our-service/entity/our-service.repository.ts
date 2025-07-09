import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import { OurService, OurServiceDocument } from './our-service.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pagination } from 'src/package/api';

@Injectable()
export class OurServiceRepository extends BaseMongoRepository<OurService> {
  constructor(
    @InjectModel(OurService.name)
    private readonly ourServiceModel: Model<OurService>,
  ) {
    super(ourServiceModel);
  }

  async findServiceByName(name: string, throwError = true): Promise<OurServiceDocument> {
    const service = await this.ourServiceModel.findOne({ name });
    if (!service && throwError) {
      throw new Error('Service not found');
    }
    return service;
  }

  async findAllServices(pagination?: Pagination): Promise<OurServiceDocument[]> {
    const { skip = 1, limit = 10 } = pagination || {};
    return this.ourServiceModel
      .find()
      .skip((skip - 1) * limit)
      .limit(limit)
      .exec();
  }
}