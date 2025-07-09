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
        const employee = await this.userRepository.findOne({
            filter: {
                email: body.email
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
        const filter = {
            role: UserRole.EMPLOYEE,
            // ...query
        }
        const employee = await this.userRepository.find({
            filter: {
                role:  UserRole.EMPLOYEE,
            },
            // options: {
            //     ...pagination
            // }
        })
        return employee
    }
}