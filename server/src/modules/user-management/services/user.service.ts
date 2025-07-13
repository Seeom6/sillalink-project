import {Injectable} from '@nestjs/common';
import {UserRepository} from '../database/repositories/user.repository';
import {User} from '../database/schemas/user.schema';
import {CreateUserDto} from '../api/dto/request/create-user.dto';
import {ClientSession} from "mongoose";
import {Pagination} from "src/package/api";
import {UserError} from "./user.error";
import {ErrorCode} from "../../../common/error/error-code";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userError: UserError,
  ) {}

  async findById(id: string, throwError = true) {
    const user = await this.userRepository.findUserById(id);
    if(!user && throwError) {
      this.userError.throw(ErrorCode.USER_NOT_FOUND)
    }
    return user;
  }

  async findUserByEmail(email: string, throwError = true, includeInactive = false) {
    return await this.userRepository.findUserByEmail(email, throwError, includeInactive);
  }

  async findUserByPhone(phone: string, throwError = true, includeInactive = false) {
    return await this.userRepository.findUserByPhone(phone, throwError, includeInactive);
  }

  async createUser(userInfo: CreateUserDto, options?: {session?: ClientSession}){
    // Check if user already exists
    const existingUser = await this.userRepository.findUserByEmail(userInfo.email, false);
    if (existingUser) {
      this.userError.throw(ErrorCode.USER_ALREADY_EXISTS);
    }

    // Check if phone number already exists (if provided)
    if (userInfo.phone) {
      const existingUserWithPhone = await this.userRepository.findUserByPhone(userInfo.phone, false);
      if (existingUserWithPhone) {
        this.userError.throw(ErrorCode.PHONE_ALREADY_EXISTS);
      }
    }

    return await this.userRepository.create({
      doc: {...userInfo} as User,
      options
    });
  }

  async getAllUsers(
    pagination?: Pagination,
    filter?: { roles?: string[] }
  ) {
    if (filter?.roles && filter.roles.length > 0) {
      return this.userRepository.find({
        filter: { role: { $in: filter.roles }, deletedAt: null },
        options: pagination
      });
    }
    return this.userRepository.findAllUsers(pagination);
  }

  async updateUser(id: string, updateData: Partial<User>) {
    const user = await this.findById(id);
    return await this.userRepository.updateUser(id, updateData);
  }

  async updateUserByEmail(email: string, update: Partial<User>) {
    return await this.userRepository.findOneAndUpdate({
      filter: { email },
      update
    });
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);
    await this.userRepository.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  async activateUser(id: string) {
    return await this.userRepository.activateUser(id);
  }

  async deactivateUser(id: string) {
    return await this.userRepository.deactivateUser(id);
  }

  async getUserStats() {
    const totalUsers = await this.userRepository.count({ deletedAt: null });
    const activeUsers = await this.userRepository.count({ isActive: true, deletedAt: null });
    const inactiveUsers = await this.userRepository.count({ isActive: false, deletedAt: null });
    
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers
    };
  }

  async searchUsers(searchTerm: string, pagination?: Pagination) {
    const searchFilter = {
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ],
      deletedAt: null
    };

    return this.userRepository.find({
      filter: searchFilter,
      options: pagination
    });
  }
}
