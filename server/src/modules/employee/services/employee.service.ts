import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../user/entity/user.repository";
import { EmployeeError } from "./employee.error";
import { CreateEmployee } from "../api/dto/requests/create-employee.dto";
import { HashService } from "src/package/auth";
import { UserRole } from "@Modules/user";
import { GetAllEmployee } from "@Modules/employee/api/dto/requests/get-all-employee.dto";
import { Pagination, QueryValue } from "src/package/api";
import {ErrorCode} from "../../../common/error/error-code";


@Injectable()
export class EmployeeService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly employeeError: EmployeeError,
    ){}

    async create(body: CreateEmployee){
        // Check for existing ACTIVE user with the same email
        // This allows recreation of employees after soft deletion
        const employee = await this.userRepository.findOne({
            filter: {
                email: body.email,
                isActive: true  // ✅ Only check active users
            }
        })
        if(employee){
            this.employeeError.throw(ErrorCode.EMPLOYEE_ALREADY_EXISTS)
        }
        const hashedPassword = await HashService.hashPassword(body.password);

        // Parse hire date or use current date
        const hireDate = body.hireDate ? new Date(body.hireDate) : new Date();

        await this.userRepository.create({
            doc: {
                email: body.email,
                employee: {
                    startDate: hireDate,
                    position: body.position,
                    image: body.image || null,
                    department: body.department,
                    employmentStatus: body.employmentStatus || 'full-time',
                    managerId: body.managerId,
                    projectIds: body.projectIds || [],
                    emergencyContact: body.emergencyContact,
                    address: body.address,
                    salary: body.salary
                },
                firstName: body.firstName,
                lastName: body.lastName,
                password: hashedPassword,
                phone: body.phone,
                isActive: true,
                role: body.role ? body.role as UserRole : UserRole.EMPLOYEE,
            }
        })

    }


    async getAll(query: QueryValue<GetAllEmployee>, pagination: Pagination){
        // Return all users regardless of role for employee management interface
        const filter = {
            // Remove role filter to include all user types (admin, operator, employee, user)
            isActive: true, // Only show active users
            // ...query
        }
        const employee = await this.userRepository.find({
            filter: {
                isActive: true, // Only show active users, but all roles
            },
            // options: {
            //     ...pagination
            // }
        })
        console.log(`📊 Employee Service: Found ${employee.length} users of all roles`)
        return employee
    }

    async getById(id: string){
        console.log('🚀 EMPLOYEE SERVICE: Getting user by ID', id, 'with role check removed');

        // Find user by ID only - remove role restriction to handle all user types
        // This aligns with getAll() method which handles all roles (admin, operator, employee, user)
        const employee = await this.userRepository.findOne({
            filter: {
                _id: id,
                isActive: true // Only check if user is active, not role-specific
            }
        })

        if(!employee){
            console.log('❌ EMPLOYEE SERVICE: User not found or inactive:', id);
            this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND)
        }

        console.log('✅ EMPLOYEE SERVICE: Found user with role:', employee.role);
        return employee
    }

    async update(id: string, body: CreateEmployee){
        console.log('🚀 EMPLOYEE SERVICE: Updating user', id, 'with role check removed');

        // Find user by ID only - remove role restriction to handle all user types
        // This aligns with getAll() method which handles all roles (admin, operator, employee, user)
        const employee = await this.userRepository.findOne({
            filter: {
                _id: id,
                isActive: true // Only check if user is active, not role-specific
            }
        })

        if(!employee){
            console.log('❌ EMPLOYEE SERVICE: User not found or inactive:', id);
            this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND)
        }

        console.log('✅ EMPLOYEE SERVICE: Found user with role:', employee.role);

        // Parse hire date if provided
        const hireDate = body.hireDate ? new Date(body.hireDate) : undefined;

        const updateData: any = {
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            isActive: true,
        }

        if(body.email && body.email !== employee.email){
            // Check if new email already exists among ACTIVE users
            const existingEmployee = await this.userRepository.findOne({
                filter: {
                    email: body.email,
                    _id: { $ne: id },
                    isActive: true  // ✅ Only check active users
                }
            })
            if(existingEmployee){
                this.employeeError.throw(ErrorCode.EMPLOYEE_ALREADY_EXISTS)
            }
            updateData.email = body.email
        }

        if(body.password){
            updateData.password = await HashService.hashPassword(body.password)
        }

        if(body.role){
            updateData.role = body.role as UserRole
        }

        // Update employee-specific fields
        updateData.employee = {
            ...employee.employee,
            position: body.position,
            image: body.image || employee.employee?.image,
            department: body.department,
            employmentStatus: body.employmentStatus || 'full-time',
            managerId: body.managerId,
            projectIds: body.projectIds || [],
            emergencyContact: body.emergencyContact,
            address: body.address,
            salary: body.salary
        }

        if(hireDate){
            updateData.employee.startDate = hireDate
        }

        console.log('🔄 EMPLOYEE SERVICE: Applying update with data:', updateData);

        await this.userRepository.findOneAndUpdate({
            filter: { _id: id },
            update: updateData
        })

        console.log('✅ EMPLOYEE SERVICE: Update completed successfully');
        return await this.getById(id)
    }

    async delete(id: string){
        console.log('🚀 EMPLOYEE SERVICE: Deleting user', id, 'with role check removed');

        // Find user by ID only - remove role restriction to handle all user types
        // This aligns with getAll(), getById(), and update() methods which handle all roles
        const employee = await this.userRepository.findOne({
            filter: {
                _id: id,
                isActive: true // Only check if user is active, not role-specific
            }
        })

        if(!employee){
            console.log('❌ EMPLOYEE SERVICE: User not found or inactive for deletion:', id);
            this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND)
        }

        console.log('✅ EMPLOYEE SERVICE: Found user with role for deletion:', employee.role);

        // Soft delete by setting isActive to false instead of hard delete
        // This preserves data integrity and allows for potential recovery
        await this.userRepository.findOneAndUpdate({
            filter: { _id: id },
            update: {
                isActive: false,
                deletedAt: new Date()
            }
        })

        console.log('✅ EMPLOYEE SERVICE: User soft deleted successfully');
        return { message: 'Employee deleted successfully' }
    }

    // Hard delete method for complete removal (use with caution)
    async hardDelete(id: string){
        console.log('🚀 EMPLOYEE SERVICE: Hard deleting user', id);

        const employee = await this.userRepository.findOne({
            filter: {
                _id: id
            }
        })

        if(!employee){
            console.log('❌ EMPLOYEE SERVICE: User not found for hard deletion:', id);
            this.employeeError.throw(ErrorCode.EMPLOYEE_NOT_FOUND)
        }

        console.log('✅ EMPLOYEE SERVICE: Found user for hard deletion:', employee.role);

        // Permanently delete the user record
        await this.userRepository.findOneAndDelete({
            filter: { _id: id }
        })

        console.log('✅ EMPLOYEE SERVICE: User permanently deleted');
        return { message: 'Employee permanently deleted' }
    }
}