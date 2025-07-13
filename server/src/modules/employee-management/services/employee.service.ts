import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../database/repositories/employee.repository";
import { UserService } from "../../user-management/services/user.service";
import { EmployeeError } from "./employee.error";
import { CreateEmployeeDto } from "../api/dto/request/create-employee.dto";
import { UpdateEmployeeDto } from "../api/dto/request/update-employee.dto";
import { HashService } from "src/package/auth";
import { UserRole } from "../../user-management/interfaces/user-role.enum";
import { Pagination } from "src/package/api";
import { ErrorCode } from "../../../common/error/error-code";
import { Types } from 'mongoose';

@Injectable()
export class EmployeeService {
    constructor(
        private readonly employeeRepository: EmployeeRepository,
        private readonly userService: UserService,
        private readonly employeeError: EmployeeError,
    ){}

    async create(createEmployeeDto: CreateEmployeeDto) {
        // First create the user
        const hashedPassword = await HashService.hashPassword(createEmployeeDto.password);
        
        const userData = {
            email: createEmployeeDto.email,
            password: hashedPassword,
            firstName: createEmployeeDto.firstName,
            lastName: createEmployeeDto.lastName,
            phone: createEmployeeDto.phone,
            role: createEmployeeDto.role || UserRole.EMPLOYEE,
            isActive: true
        };

        const user = await this.userService.createUser(userData);

        // Then create the employee record
        const employeeData = {
            userId: new Types.ObjectId(user._id.toString()),
            position: createEmployeeDto.position,
            startDate: createEmployeeDto.hireDate ? new Date(createEmployeeDto.hireDate) : new Date(),
            image: createEmployeeDto.image,
            department: createEmployeeDto.department,
            employmentStatus: createEmployeeDto.employmentStatus || 'full-time',
            managerId: createEmployeeDto.managerId ? new Types.ObjectId(createEmployeeDto.managerId) : undefined,
            projectIds: createEmployeeDto.projectIds?.map(id => new Types.ObjectId(id)) || [],
            emergencyContact: createEmployeeDto.emergencyContact,
            address: createEmployeeDto.address,
            salary: createEmployeeDto.salary,
            isActive: true
        };

        const employee = await this.employeeRepository.create({
            doc: employeeData
        });

        return employee;
    }

    async getAll(filters?: any, pagination?: Pagination) {
        return await this.employeeRepository.findAllEmployees(pagination);
    }

    async getById(id: string) {
        const employee = await this.employeeRepository.findEmployeeById(id);
        if (!employee) {
            this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
        }
        return employee;
    }

    async getByUserId(userId: string) {
        const employee = await this.employeeRepository.findEmployeeByUserId(userId);
        if (!employee) {
            this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND);
        }
        return employee;
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
        const employee = await this.getById(id);
        
        // Update user data if provided
        if (updateEmployeeDto.firstName || updateEmployeeDto.lastName || 
            updateEmployeeDto.email || updateEmployeeDto.phone || updateEmployeeDto.password) {
            
            const userUpdateData: any = {};
            if (updateEmployeeDto.firstName) userUpdateData.firstName = updateEmployeeDto.firstName;
            if (updateEmployeeDto.lastName) userUpdateData.lastName = updateEmployeeDto.lastName;
            if (updateEmployeeDto.email) userUpdateData.email = updateEmployeeDto.email;
            if (updateEmployeeDto.phone) userUpdateData.phone = updateEmployeeDto.phone;
            if (updateEmployeeDto.password) {
                userUpdateData.password = await HashService.hashPassword(updateEmployeeDto.password);
            }

            await this.userService.updateUser(employee.userId.toString(), userUpdateData);
        }

        // Update employee data
        const employeeUpdateData: any = {};
        if (updateEmployeeDto.position) employeeUpdateData.position = updateEmployeeDto.position;
        if (updateEmployeeDto.department) employeeUpdateData.department = updateEmployeeDto.department;
        if (updateEmployeeDto.employmentStatus) employeeUpdateData.employmentStatus = updateEmployeeDto.employmentStatus;
        if (updateEmployeeDto.managerId) employeeUpdateData.managerId = new Types.ObjectId(updateEmployeeDto.managerId);
        if (updateEmployeeDto.projectIds) employeeUpdateData.projectIds = updateEmployeeDto.projectIds.map(id => new Types.ObjectId(id));
        if (updateEmployeeDto.emergencyContact) employeeUpdateData.emergencyContact = updateEmployeeDto.emergencyContact;
        if (updateEmployeeDto.address) employeeUpdateData.address = updateEmployeeDto.address;
        if (updateEmployeeDto.salary) employeeUpdateData.salary = updateEmployeeDto.salary;
        if (updateEmployeeDto.image) employeeUpdateData.image = updateEmployeeDto.image;

        return await this.employeeRepository.updateEmployee(id, employeeUpdateData);
    }

    async delete(id: string) {
        const employee = await this.getById(id);
        
        // Soft delete the employee
        await this.employeeRepository.deleteEmployee(id);
        
        // Deactivate the associated user
        await this.userService.deactivateUser(employee.userId.toString());
        
        return { message: 'Employee deleted successfully' };
    }

    async getEmployeesByDepartment(department: string) {
        return await this.employeeRepository.findEmployeesByDepartment(department);
    }

    async getEmployeesByManager(managerId: string) {
        return await this.employeeRepository.findEmployeesByManager(managerId);
    }

    async getEmployeeStats() {
        return await this.employeeRepository.getEmployeeStats();
    }

    async activateEmployee(id: string) {
        const employee = await this.getById(id);
        await this.userService.activateUser(employee.userId.toString());
        return await this.employeeRepository.activateEmployee(id);
    }

    async deactivateEmployee(id: string) {
        const employee = await this.getById(id);
        await this.userService.deactivateUser(employee.userId.toString());
        return await this.employeeRepository.deactivateEmployee(id);
    }
}
