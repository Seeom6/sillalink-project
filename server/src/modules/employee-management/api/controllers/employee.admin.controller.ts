import {Body, Get, Post, Query, Param, Put, Delete, Patch} from '@nestjs/common';
import {AuthControllerAdmin, parseQuery, Pagination} from 'src/package/api';
import { EmployeeService } from '../../services/employee.service';
import { CreateEmployeeDto } from '../dto/request/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/request/update-employee.dto';
import { GetAllEmployeeDto } from '../dto/request/get-all-employee.dto';
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '../../../user-management/interfaces/user-role.enum';
import { RequiresAdminVerification, SensitiveOperation } from 'src/package/security/decorators/admin-verification.decorator';
import { RateLimit } from 'src/package/security/decorators/rate-limit.decorator';

@AuthControllerAdmin({
    prefix: 'employees',
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
        @Body() body: CreateEmployeeDto,
    ){
        return await this.employeeService.create(body)
    }

    @Get("")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @RateLimit({ windowMs: 60000, maxRequests: 30 }) // 30 requests per minute
    async getAll(
        @Query() query: GetAllEmployeeDto
    ){
        const {pagination, myQuery} = parseQuery(query)
        const employees = await this.employeeService.getAll(query, pagination)
        return employees;
    }

    @Get(":id")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async getById(@Param('id') id: string){
        return await this.employeeService.getById(id);
    }

    @Put(":id")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @RequiresAdminVerification()
    @SensitiveOperation()
    async update(
        @Param('id') id: string,
        @Body() body: UpdateEmployeeDto
    ){
        return await this.employeeService.update(id, body);
    }

    @Delete(":id")
    @Roles(UserRole.ADMIN)
    @RequiresAdminVerification()
    @SensitiveOperation()
    async delete(@Param('id') id: string){
        return await this.employeeService.delete(id);
    }

    @Patch(":id/activate")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async activate(@Param('id') id: string){
        return await this.employeeService.activateEmployee(id);
    }

    @Patch(":id/deactivate")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async deactivate(@Param('id') id: string){
        return await this.employeeService.deactivateEmployee(id);
    }

    @Get("department/:department")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async getByDepartment(@Param('department') department: string){
        return await this.employeeService.getEmployeesByDepartment(department);
    }

    @Get("manager/:managerId")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async getByManager(@Param('managerId') managerId: string){
        return await this.employeeService.getEmployeesByManager(managerId);
    }

    @Get("stats/overview")
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async getStats(){
        return await this.employeeService.getEmployeeStats();
    }
}
