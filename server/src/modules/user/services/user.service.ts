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

  async findUserByEmail(email: string, throwError = true, includeInactive = false) {
    return await this.userRepository.findUserByEmail(email, throwError, includeInactive);
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

  async updateUserById(id: string, updateData: any) {
    console.log('🚀 USER SERVICE: Updating user by ID', id, 'with data:', updateData);

    // Find the existing user
    const existingUser = await this.userRepository.findOne({
      filter: { _id: id }
    });

    if (!existingUser) {
      this.userError.throw(ErrorCode.USER_NOT_FOUND);
    }

    // Prepare update object
    const update: any = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      phone: updateData.phone,
      isActive: true,
    };

    // Handle email update with duplicate check (only among active users)
    if (updateData.email && updateData.email !== existingUser.email) {
      const existingEmailUser = await this.userRepository.findOne({
        filter: {
          email: updateData.email,
          _id: { $ne: id },
          isActive: true  // ✅ Only check active users
        }
      });
      if (existingEmailUser) {
        throw new Error('Email already exists');
      }
      update.email = updateData.email;
    }

    // Handle role update
    if (updateData.role) {
      update.role = updateData.role;
    }

    // Handle employee data update
    if (updateData.position || updateData.department || updateData.employmentStatus ||
        updateData.hireDate || updateData.emergencyContact || updateData.address || updateData.salary) {

      // Preserve existing employee data and update with new values
      update.employee = {
        ...existingUser.employee,
        position: updateData.position || existingUser.employee?.position,
        department: updateData.department || existingUser.employee?.department,
        employmentStatus: updateData.employmentStatus || existingUser.employee?.employmentStatus || 'full-time',
        image: updateData.image || existingUser.employee?.image,
        managerId: updateData.managerId || existingUser.employee?.managerId,
        projectIds: updateData.projectIds || existingUser.employee?.projectIds || [],
        emergencyContact: updateData.emergencyContact || existingUser.employee?.emergencyContact,
        address: updateData.address || existingUser.employee?.address,
        salary: updateData.salary || existingUser.employee?.salary
      };

      // Handle hire date
      if (updateData.hireDate) {
        update.employee.startDate = new Date(updateData.hireDate);
      }
    }

    console.log('🔄 USER SERVICE: Final update object:', update);

    // Perform the update
    const updatedUser = await this.userRepository.findOneAndUpdate({
      filter: { _id: id },
      update,
      options: { new: true }
    });

    console.log('✅ USER SERVICE: User updated successfully');
    return updatedUser;
  }
}
