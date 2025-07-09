import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import {User, UserDocument} from './user.schema';
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

  async findUserByEmail(email: string, throwError = true): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
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
}
