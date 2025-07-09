import {Body, Get, Post, Query} from '@nestjs/common';
import {AuthControllerAdmin, parseQuery, Pagination} from 'src/package/api';
import { EmployeeService } from '@Modules/employee/services/employee.service';
import { CreateEmployeeValidation } from '../validation/create-employee.validation';
import { CreateEmployee } from '../dto/requests/create-employee.dto';
import { GetAllEmployee } from '../dto/requests/get-all-employee.dto';
import {GetAllEmployeeDto} from "@Modules/employee/api/dto/response/get-all-employee.dto";
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '@Modules/user';
import { RateLimit } from 'src/package/security/decorators/rate-limit.decorator';
import { RequiresAdminVerification, SensitiveOperation } from 'src/package/security/decorators/admin-verification.decorator';

@AuthControllerAdmin({
    prefix: 'employee',
})
export class EmployeeAdminController {

    constructor(
        private readonly employeeService: EmployeeService
    ) {}

    @Post("")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @RequiresAdminVerification()
    @SensitiveOperation()
    @RateLimit({ windowMs: 60000, maxRequests: 10 }) // 10 requests per minute
    async create(
        @Body(CreateEmployeeValidation) body: CreateEmployee,
    ){
        return await this.employeeService.create(body)
    }

    @Get("")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @RateLimit({ windowMs: 60000, maxRequests: 30 }) // 30 requests per minute
    async getAll(
        @Query() query: GetAllEmployee
    ){
        const {pagination, myQuery} = parseQuery(query)
        const employee = await this.employeeService.getAll(query, pagination)
        return employee.map(p => new GetAllEmployeeDto(p))
    }
}
