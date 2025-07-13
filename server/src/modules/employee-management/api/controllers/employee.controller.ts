import { Get, Param } from '@nestjs/common';
import { ControllerWeb, User } from 'src/package/api';
import { EmployeeService } from '../../services/employee.service';
import { UserPayload } from 'src/package/auth';

@ControllerWeb({
    prefix: 'employees',
})
export class EmployeeController {

    constructor(
        private readonly employeeService: EmployeeService
    ) {}

    @Get("me")
    async getMyProfile(@User() user: UserPayload){
        return await this.employeeService.getByUserId(user.id);
    }

    @Get("public")
    async getPublicEmployees(){
        // Return only basic public information
        const employees = await this.employeeService.getAll();
        return employees.map(emp => ({
            id: emp._id,
            position: emp.position,
            department: emp.department,
            image: emp.image,
            user: {
                firstName: (emp.userId as any)?.firstName,
                lastName: (emp.userId as any)?.lastName
            }
        }));
    }
}
