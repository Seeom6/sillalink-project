import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import { Employee, EmployeeDocument } from '../schemas/employee.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pagination } from 'src/package/api';

@Injectable()
export class EmployeeRepository extends BaseMongoRepository<Employee> {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<Employee>,
  ) {
    super(employeeModel);
  }

  async findEmployeeByUserId(userId: string): Promise<EmployeeDocument> {
    return this.employeeModel.findOne({ 
      userId: new Types.ObjectId(userId),
      deletedAt: null 
    }).populate('userId', 'firstName lastName email phone');
  }

  async findAllEmployees(pagination?: Pagination): Promise<EmployeeDocument[]> {
    const { skip = 1, limit = 10 } = pagination || {};
    return this.employeeModel
      .find({ deletedAt: null })
      .populate('userId', 'firstName lastName email phone')
      .populate('managerId', 'userId')
      .skip((skip - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findEmployeeById(id: string): Promise<EmployeeDocument> {
    return this.employeeModel
      .findOne({ _id: id, deletedAt: null })
      .populate('userId', 'firstName lastName email phone')
      .populate('managerId', 'userId');
  }

  async findEmployeesByDepartment(department: string): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find({ department, deletedAt: null })
      .populate('userId', 'firstName lastName email phone');
  }

  async findEmployeesByManager(managerId: string): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find({ 
        managerId: new Types.ObjectId(managerId), 
        deletedAt: null 
      })
      .populate('userId', 'firstName lastName email phone');
  }

  async updateEmployee(id: string, updateData: Partial<Employee>): Promise<EmployeeDocument> {
    return this.employeeModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', 'firstName lastName email phone');
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.employeeModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  }

  async activateEmployee(id: string): Promise<EmployeeDocument> {
    return this.employeeModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }

  async deactivateEmployee(id: string): Promise<EmployeeDocument> {
    return this.employeeModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async countEmployeesByDepartment(): Promise<any[]> {
    return this.employeeModel.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
  }

  async getEmployeeStats(): Promise<any> {
    const stats = await this.employeeModel.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          fullTime: { $sum: { $cond: [{ $eq: ['$employmentStatus', 'full-time'] }, 1, 0] } },
          partTime: { $sum: { $cond: [{ $eq: ['$employmentStatus', 'part-time'] }, 1, 0] } },
          contractors: { $sum: { $cond: [{ $eq: ['$employmentStatus', 'contractor'] }, 1, 0] } },
          interns: { $sum: { $cond: [{ $eq: ['$employmentStatus', 'intern'] }, 1, 0] } }
        }
      }
    ]);
    
    return stats[0] || {
      total: 0,
      active: 0,
      fullTime: 0,
      partTime: 0,
      contractors: 0,
      interns: 0
    };
  }
}
