import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeAdminController } from "./api/controllers/employee.admin.controller";
import { EmployeeController } from "./api/controllers/employee.controller";
import { EmployeeService } from "./services/employee.service";
import { EmployeeError } from "./services/employee.error";
import { Employee, EmployeeSchema } from './database/schemas/employee.schema';
import { EmployeeRepository } from './database/repositories/employee.repository';
import { UserManagementModule } from "../user-management/user-management.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
        UserManagementModule
    ],
    controllers: [EmployeeAdminController, EmployeeController],
    providers: [EmployeeService, EmployeeRepository, EmployeeError],
    exports: [EmployeeService, EmployeeRepository]
})
export class EmployeeManagementModule{}
