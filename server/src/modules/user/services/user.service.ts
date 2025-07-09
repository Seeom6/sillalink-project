import {Injectable} from '@nestjs/common';
import {UserRepository} from '../entity/user.repository';
import {User} from '@Modules/user';
import {CreateUserDto} from '../api/dto/request/create-user.dto';
import {ClientSession} from "mongoose";
import {Pagination} from "src/package/api";
import {UserError} from "@Modules/user/services/user.error";
import {ErrorCode} from "../../../common/error/error-code";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userError: UserError,
  ) {}

  async findById(id: string, throwError = true) {
    const user = this.userRepository.findOne({filter: {_id: id}});
    if(!user && throwError) {
      this.userError.throw(ErrorCode.USER_NOT_FOUND)
    }
    return user;
  }

  async findUserByEmail(email: string, throwError = true) {
    return await this.userRepository.findUserByEmail(email, throwError);
  }

  async createUser(userInfo: CreateUserDto, options?: {session?: ClientSession}){
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
        filter: { role: { $in: filter.roles } },
        options: pagination
      });
    }
    return this.userRepository.findAllUsers(pagination);
  }

  async updateUserByEmail(email: string, update: Partial<User>) {
    return await this.userRepository.findOneAndUpdate({
      filter: { email },
      update,
      options: { new: true }
    });
  }
}
