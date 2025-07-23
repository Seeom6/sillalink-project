import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@Package/database/mongodb';
import { Employee, EmployeeDocument, EmployeeStatus, EmployeeDepartment } from '../schemas/employee.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EmployeeRepository extends BaseMongoRepository<Employee> {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<Employee>,
  ) {
    super(employeeModel);
  }

  async findAllWithFilters(filters: any): Promise<{
    employees: EmployeeDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, department, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: false };
    
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [employees, total] = await Promise.all([
      this.employeeModel
        .find(query)
        .populate('userId', 'firstName lastName email')
        .populate('managerId', 'firstName lastName position')
        .populate('technologies.technologyId', 'name category icon')
        .skip(skip)
        .limit(limit)
        .sort(sortOptions),
      this.employeeModel.countDocuments(query)
    ]);

    return {
      employees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByEmployeeId(employeeId: string): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ employeeId, isDeleted: false })
      .populate('userId', 'firstName lastName email')
      .populate('managerId', 'firstName lastName position')
      .populate('technologies.technologyId', 'name category icon');
  }

  async findByEmail(email: string): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ email: email.toLowerCase(), isDeleted: false })
      .populate('userId', 'firstName lastName email')
      .populate('managerId', 'firstName lastName position')
      .populate('technologies.technologyId', 'name category icon');
  }

  async findByUserId(userId: string): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ userId, isDeleted: false })
      .populate('userId', 'firstName lastName email')
      .populate('managerId', 'firstName lastName position')
      .populate('technologies.technologyId', 'name category icon');
  }

  async searchEmployees(searchTerm: string, limit: number = 10): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find({
        isDeleted: false,
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { position: { $regex: searchTerm, $options: 'i' } },
          { employeeId: { $regex: searchTerm, $options: 'i' } },
          { skills: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      })
      .populate('userId', 'firstName lastName email')
      .populate('managerId', 'firstName lastName position')
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getEmployeeStats(): Promise<any> {
    const stats = await this.employeeModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
          onLeave: { $sum: { $cond: [{ $eq: ['$status', 'on_leave'] }, 1, 0] } },
          terminated: { $sum: { $cond: [{ $eq: ['$status', 'terminated'] }, 1, 0] } },
          featured: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          avgTenure: { 
            $avg: { 
              $divide: [
                { $subtract: [new Date(), '$hireDate'] },
                1000 * 60 * 60 * 24 * 365 // Convert to years
              ]
            }
          }
        }
      }
    ]);
    
    return stats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      onLeave: 0,
      terminated: 0,
      featured: 0,
      avgTenure: 0
    };
  }

  async getEmployeesByDepartment(): Promise<any[]> {
    return this.employeeModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async getFeaturedEmployees(limit: number = 10): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find({ isFeatured: true, isDeleted: false })
      .populate('userId', 'firstName lastName email')
      .populate('managerId', 'firstName lastName position')
      .populate('technologies.technologyId', 'name category icon')
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getEmployeesByManager(managerId: string): Promise<EmployeeDocument[]> {
    return this.employeeModel
      .find({ managerId, isDeleted: false })
      .populate('userId', 'firstName lastName email')
      .populate('technologies.technologyId', 'name category icon')
      .sort({ firstName: 1, lastName: 1 });
  }

  async generateEmployeeId(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `EMP${currentYear}`;
    
    // Find the highest employee ID for the current year
    const lastEmployee = await this.employeeModel
      .findOne({ 
        employeeId: { $regex: `^${prefix}` },
        isDeleted: false 
      })
      .sort({ employeeId: -1 });

    if (!lastEmployee) {
      return `${prefix}001`;
    }

    const lastNumber = parseInt(lastEmployee.employeeId.replace(prefix, ''));
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
    
    return `${prefix}${nextNumber}`;
  }

  async updateTechnologyProficiency(
    employeeId: string, 
    technologyId: string, 
    proficiencyLevel: number
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel.findOneAndUpdate(
      { 
        _id: employeeId, 
        isDeleted: false,
        'technologies.technologyId': technologyId 
      },
      { 
        $set: { 
          'technologies.$.proficiencyLevel': proficiencyLevel,
          'technologies.$.lastUpdated': new Date()
        }
      },
      { new: true }
    ).populate('technologies.technologyId', 'name category icon');
  }

  async addTechnologyToEmployee(
    employeeId: string, 
    technologyId: string, 
    proficiencyLevel: number = 0
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel.findOneAndUpdate(
      { _id: employeeId, isDeleted: false },
      { 
        $addToSet: { 
          technologies: {
            technologyId,
            proficiencyLevel,
            assignedAt: new Date(),
            lastUpdated: new Date()
          }
        }
      },
      { new: true }
    ).populate('technologies.technologyId', 'name category icon');
  }

  async removeTechnologyFromEmployee(
    employeeId: string, 
    technologyId: string
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel.findOneAndUpdate(
      { _id: employeeId, isDeleted: false },
      { 
        $pull: { 
          technologies: { technologyId }
        }
      },
      { new: true }
    ).populate('technologies.technologyId', 'name category icon');
  }
}
