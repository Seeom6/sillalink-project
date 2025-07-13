import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import {User, UserDocument} from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pagination} from 'src/package/api';

@Injectable()
export class UserRepository extends BaseMongoRepository<User> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  async findUserByEmail(email: string, throwError = true, includeInactive = false): Promise<UserDocument> {
    // By default, only find active users unless explicitly requested to include inactive ones
    const filter = includeInactive ? { email } : { email, isActive: true };
    const user = await this.userModel.findOne(filter);
    if (!user && throwError) {
      throw new Error('User not found');
    }
    return user;
  }

  async findUserByPhone(phone: string, throwError = true, includeInactive = false): Promise<UserDocument> {
    // By default, only find active users unless explicitly requested to include inactive ones
    const filter = includeInactive ? { phone } : { phone, isActive: true };
    const user = await this.userModel.findOne(filter);
    if (!user && throwError) {
      throw new Error('User not found');
    }
    return user;
  }

  async findAllUsers(pagination?: Pagination): Promise<User[]> {
    const { skip = 1, limit = 10 } = pagination || {};
    return this.userModel
      .find()
      .skip((skip - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  }

  async activateUser(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }

  async deactivateUser(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async count(filter: any): Promise<number> {
    return this.userModel.countDocuments(filter);
  }
}
