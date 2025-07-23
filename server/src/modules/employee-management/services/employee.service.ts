import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../database/repositories/employee.repository';
import { EmployeeError } from './employee.error';
import { CreateEmployeeDto } from '../api/dto/request/create-employee.dto';
import { UpdateEmployeeDto } from '../api/dto/request/update-employee.dto';
import { GetAllEmployeesDto } from '../api/dto/request/get-all-employees.dto';
import { CreatePerformanceReviewDto, UpdatePerformanceReviewDto } from '../api/dto/request/performance-review.dto';
import { CreateEmployeeProjectDto, UpdateEmployeeProjectDto } from '../api/dto/request/employee-project.dto';
import { CreateTrainingDto, UpdateTrainingDto } from '../api/dto/request/training.dto';
import { CreateAchievementDto, UpdateAchievementDto } from '../api/dto/request/achievement.dto';
import { CreateDisciplinaryActionDto, UpdateDisciplinaryActionDto } from '../api/dto/request/disciplinary-action.dto';
import { EmployeeDocument, EmployeeDepartment, EmployeeStatus } from '../database/schemas/employee.schema';
import { ErrorCode } from '../../../common/error/error-code';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeeError: EmployeeError
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDocument> {
    // Check if employee already exists by email
    const existingEmployee = await this.employeeRepository.findByEmail(createEmployeeDto.email);

    if (existingEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_ALREADY_EXISTS);
    }

    // Generate unique employee ID
    const employeeId = await this.employeeRepository.generateEmployeeId();

    // Create the employee
    const employee = await this.employeeRepository.create({
      doc: {
        ...createEmployeeDto,
        employeeId,
        email: createEmployeeDto.email.toLowerCase(),
        status: createEmployeeDto.status || EmployeeStatus.ACTIVE,
        department: createEmployeeDto.department || EmployeeDepartment.OTHER,
        hireDate: createEmployeeDto.hireDate || new Date(),
        skills: createEmployeeDto.skills || [],
        certifications: createEmployeeDto.certifications || [],
        technologies: [],
        technologySkills: [],
        directReports: [],
        // Initialize new arrays
        bonuses: [],
        deductions: [],
        performanceReviews: [],
        achievements: [],
        projects: [],
        trainings: [],
        disciplinaryActions: [],
        isFeatured: createEmployeeDto.isFeatured || false,
        isDeleted: false,
        profileImage: createEmployeeDto.profileImage || '',
        avatar: createEmployeeDto.avatar || ''
      } as any
    });

    return employee;
  }

  async findAll(filters: GetAllEmployeesDto): Promise<{
    employees: EmployeeDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.employeeRepository.findAllWithFilters(filters);
  }

  async findById(id: string): Promise<EmployeeDocument> {
    const employee = await this.employeeRepository.findOne({
      filter: { _id: id, isDeleted: false }
    });

    if (!employee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }

  async findByEmployeeId(employeeId: string): Promise<EmployeeDocument> {
    const employee = await this.employeeRepository.findByEmployeeId(employeeId);

    if (!employee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }

  async findByEmail(email: string): Promise<EmployeeDocument> {
    const employee = await this.employeeRepository.findByEmail(email);

    if (!employee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }

  async findByUserId(userId: string): Promise<EmployeeDocument | null> {
    return this.employeeRepository.findByUserId(userId);
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeDocument> {
    const employee = await this.findById(id);

    // Check if email is being changed and if it already exists
    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmployee = await this.employeeRepository.findByEmail(updateEmployeeDto.email);
      if (existingEmployee && existingEmployee._id.toString() !== id) {
        this.employeeError.throw(ErrorCode.EMPLOYEE_EMAIL_ALREADY_EXISTS);
      }
    }

    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: id, isDeleted: false },
      update: {
        ...updateEmployeeDto,
        email: updateEmployeeDto.email?.toLowerCase()
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async delete(id: string): Promise<void> {
    const employee = await this.findById(id);

    // Hard delete - actually remove from database
    await this.employeeRepository.findOneAndDelete({
      filter: { _id: id }
    });
  }

  async softDelete(id: string): Promise<void> {
    const employee = await this.findById(id);

    // Soft delete - mark as deleted but keep in database
    await this.employeeRepository.findOneAndUpdate({
      filter: { _id: id },
      update: { isDeleted: true, deletedAt: new Date() }
    });
  }

  async searchEmployees(searchTerm: string, limit: number = 10): Promise<EmployeeDocument[]> {
    return this.employeeRepository.searchEmployees(searchTerm, limit);
  }

  async getEmployeeStats(): Promise<any> {
    return this.employeeRepository.getEmployeeStats();
  }

  async getEmployeesByDepartment(): Promise<any[]> {
    return this.employeeRepository.getEmployeesByDepartment();
  }

  async getFeaturedEmployees(limit: number = 10): Promise<EmployeeDocument[]> {
    return this.employeeRepository.getFeaturedEmployees(limit);
  }

  async getEmployeesByManager(managerId: string): Promise<EmployeeDocument[]> {
    return this.employeeRepository.getEmployeesByManager(managerId);
  }

  async updateProfileImage(id: string, imageUrl: string): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: id, isDeleted: false },
      update: { profileImage: imageUrl },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async assignTechnology(
    employeeId: string, 
    technologyId: string, 
    proficiencyLevel: number = 0
  ): Promise<EmployeeDocument> {
    const employee = await this.findById(employeeId);

    // Check if technology is already assigned
    const existingTech = employee.technologySkills.find(
      tech => tech.technologyId.toString() === technologyId
    );

    if (existingTech) {
      // Update existing proficiency
      return this.employeeRepository.updateTechnologyProficiency(
        employeeId, 
        technologyId, 
        proficiencyLevel
      );
    } else {
      // Add new technology
      return this.employeeRepository.addTechnologyToEmployee(
        employeeId, 
        technologyId, 
        proficiencyLevel
      );
    }
  }

  async removeTechnology(employeeId: string, technologyId: string): Promise<EmployeeDocument> {
    await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.removeTechnologyFromEmployee(
      employeeId,
      technologyId
    );

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async updateTechnologyProficiency(
    employeeId: string,
    technologyId: string,
    proficiencyLevel: number
  ): Promise<EmployeeDocument> {
    if (proficiencyLevel < 0 || proficiencyLevel > 100) {
      this.employeeError.throw(ErrorCode.INVALID_PROFICIENCY_LEVEL);
    }

    await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.updateTechnologyProficiency(
      employeeId,
      technologyId,
      proficiencyLevel
    );

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async linkUserToEmployee(userId: string, employeeId: string): Promise<EmployeeDocument> {
    await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: { userId },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  // Performance Review Management
  async addPerformanceReview(employeeId: string, reviewData: CreatePerformanceReviewDto): Promise<EmployeeDocument> {
    const employee = await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $push: { performanceReviews: reviewData }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async updatePerformanceReview(
    employeeId: string,
    reviewId: string,
    reviewData: UpdatePerformanceReviewDto
  ): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: {
        _id: employeeId,
        isDeleted: false,
        'performanceReviews._id': reviewId
      },
      update: {
        $set: {
          'performanceReviews.$': { ...reviewData, _id: reviewId }
        }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async removePerformanceReview(employeeId: string, reviewId: string): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $pull: { performanceReviews: { _id: reviewId } }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  // Project Management
  async addProject(employeeId: string, projectData: CreateEmployeeProjectDto): Promise<EmployeeDocument> {
    const employee = await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $push: { projects: projectData }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async updateProject(
    employeeId: string,
    projectId: string,
    projectData: UpdateEmployeeProjectDto
  ): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: {
        _id: employeeId,
        isDeleted: false,
        'projects._id': projectId
      },
      update: {
        $set: {
          'projects.$': { ...projectData, _id: projectId }
        }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async removeProject(employeeId: string, projectId: string): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $pull: { projects: { _id: projectId } }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  // Training Management
  async addTraining(employeeId: string, trainingData: CreateTrainingDto): Promise<EmployeeDocument> {
    const employee = await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $push: { trainings: trainingData }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async updateTraining(
    employeeId: string,
    trainingId: string,
    trainingData: UpdateTrainingDto
  ): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: {
        _id: employeeId,
        isDeleted: false,
        'trainings._id': trainingId
      },
      update: {
        $set: {
          'trainings.$': { ...trainingData, _id: trainingId }
        }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async removeTraining(employeeId: string, trainingId: string): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $pull: { trainings: { _id: trainingId } }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  // Achievement Management
  async addAchievement(employeeId: string, achievementData: CreateAchievementDto): Promise<EmployeeDocument> {
    const employee = await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $push: { achievements: achievementData }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async updateAchievement(
    employeeId: string,
    achievementId: string,
    achievementData: UpdateAchievementDto
  ): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: {
        _id: employeeId,
        isDeleted: false,
        'achievements._id': achievementId
      },
      update: {
        $set: {
          'achievements.$': { ...achievementData, _id: achievementId }
        }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async removeAchievement(employeeId: string, achievementId: string): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $pull: { achievements: { _id: achievementId } }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  // Disciplinary Action Management
  async addDisciplinaryAction(employeeId: string, actionData: CreateDisciplinaryActionDto): Promise<EmployeeDocument> {
    const employee = await this.findById(employeeId);

    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $push: { disciplinaryActions: actionData }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async updateDisciplinaryAction(
    employeeId: string,
    actionId: string,
    actionData: UpdateDisciplinaryActionDto
  ): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: {
        _id: employeeId,
        isDeleted: false,
        'disciplinaryActions._id': actionId
      },
      update: {
        $set: {
          'disciplinaryActions.$': { ...actionData, _id: actionId }
        }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  async removeDisciplinaryAction(employeeId: string, actionId: string): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $pull: { disciplinaryActions: { _id: actionId } }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  // Attendance Management
  async updateAttendanceSummary(employeeId: string, attendanceData: any): Promise<EmployeeDocument> {
    const updatedEmployee = await this.employeeRepository.findOneAndUpdate({
      filter: { _id: employeeId, isDeleted: false },
      update: {
        $set: {
          attendanceSummary: {
            ...attendanceData,
            lastUpdated: new Date()
          }
        }
      },
      options: { new: true }
    });

    if (!updatedEmployee) {
      this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
    }

    return updatedEmployee;
  }

  // Advanced Analytics and Reporting
  async getEmployeeAnalytics(employeeId: string): Promise<any> {
    const employee = await this.findById(employeeId);

    const analytics = {
      performanceMetrics: {
        averageRating: employee.performanceReviews.length > 0
          ? employee.performanceReviews.reduce((sum, review) => sum + review.rating, 0) / employee.performanceReviews.length
          : 0,
        totalReviews: employee.performanceReviews.length,
        lastReviewDate: employee.performanceReviews.length > 0
          ? employee.performanceReviews[employee.performanceReviews.length - 1].date
          : null
      },
      projectMetrics: {
        totalProjects: employee.projects.length,
        activeProjects: employee.projects.filter(p => !p.endDate).length,
        completedProjects: employee.projects.filter(p => p.endDate).length
      },
      trainingMetrics: {
        totalTrainings: employee.trainings.length,
        verifiedCertifications: employee.trainings.filter(t => t.isVerified).length,
        totalTrainingHours: employee.trainings.reduce((sum, training) => sum + (training.durationHours || 0), 0)
      },
      achievementMetrics: {
        totalAchievements: employee.achievements.length,
        achievementsByCategory: employee.achievements.reduce((acc, achievement) => {
          acc[achievement.category] = (acc[achievement.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      disciplinaryMetrics: {
        totalActions: employee.disciplinaryActions.length,
        resolvedActions: employee.disciplinaryActions.filter(a => a.isResolved).length,
        pendingActions: employee.disciplinaryActions.filter(a => !a.isResolved).length
      },
      attendanceMetrics: employee.attendanceSummary || {
        totalWorkingDays: 0,
        totalDaysPresent: 0,
        totalDaysAbsent: 0,
        totalLateDays: 0,
        totalOvertimeHours: 0
      }
    };

    return analytics;
  }

  // Generate Employee Report Data
  async generateEmployeeReport(employeeId: string): Promise<any> {
    const employee = await this.findById(employeeId);
    const analytics = await this.getEmployeeAnalytics(employeeId);

    return {
      personalInfo: {
        fullName: `${employee.firstName} ${employee.lastName}`,
        employeeId: employee.employeeId,
        email: employee.email,
        phone: employee.phone,
        birthDate: employee.birthDate || employee.dateOfBirth,
        gender: employee.gender,
        maritalStatus: employee.maritalStatus,
        address: employee.address
      },
      professionalInfo: {
        position: employee.position,
        jobTitle: employee.jobTitle,
        department: employee.department,
        employmentType: employee.employmentType,
        contractType: employee.contractType,
        startDate: employee.startDate || employee.hireDate,
        endDate: employee.endDate || employee.terminationDate,
        status: employee.status,
        managerId: employee.managerId
      },
      compensation: {
        salary: employee.salary,
        salaryDetails: employee.salaryDetails,
        bonuses: employee.bonuses,
        deductions: employee.deductions
      },
      performance: {
        reviews: employee.performanceReviews,
        achievements: employee.achievements,
        analytics: analytics.performanceMetrics
      },
      projects: {
        list: employee.projects,
        analytics: analytics.projectMetrics
      },
      training: {
        list: employee.trainings,
        analytics: analytics.trainingMetrics
      },
      discipline: {
        actions: employee.disciplinaryActions,
        analytics: analytics.disciplinaryMetrics
      },
      attendance: {
        summary: employee.attendanceSummary,
        analytics: analytics.attendanceMetrics
      },
      technologies: employee.technologies,
      skills: employee.skills,
      certifications: employee.certifications,
      notes: employee.notes,
      generatedAt: new Date()
    };
  }
}
