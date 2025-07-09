import { Get, Patch, Body } from '@nestjs/common';
import { AuthControllerWeb, User } from 'src/package/api';
import { UserPayload } from 'src/package/auth';
import { UserService } from '@Modules/user';
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '@Modules/user';

@AuthControllerWeb({
    prefix: 'employee',
})
export class EmployeeController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('profile')
    @Roles(UserRole.EMPLOYEE, UserRole.USER)
    async getProfile(@User() user: UserPayload) {
        const userData = await this.userService.findById(user.id);
        return {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            employee: userData.employee,
            phone: userData.phone,
            isActive: userData.isActive
        };
    }

    @Patch('profile')
    @Roles(UserRole.EMPLOYEE, UserRole.USER)
    async updateProfile(
        @User() user: UserPayload,
        @Body() updateData: {
            firstName?: string;
            lastName?: string;
            phone?: string;
        }
    ) {
        const userData = await this.userService.findById(user.id);
        await this.userService.updateUserByEmail(userData.email, updateData);
        return { message: 'Profile updated successfully' };
    }

    @Get('tasks')
    @Roles(UserRole.EMPLOYEE, UserRole.USER)
    async getTasks(@User() user: UserPayload) {
        // This would integrate with a task management system
        // For now, return a placeholder
        return {
            tasks: [],
            message: 'Task management system integration pending'
        };
    }
}
