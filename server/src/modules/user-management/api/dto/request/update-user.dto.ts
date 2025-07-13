import { UserRole } from '../../../interfaces/user-role.enum';

export class UpdateUserDto {
   email?: string;
   password?: string;
   firstName?: string;
   lastName?: string;
   phone?: string;
   role?: UserRole;
   isActive?: boolean;
}
