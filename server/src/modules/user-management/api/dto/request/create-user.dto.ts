import { UserRole } from '../../../interfaces/user-role.enum';

export class CreateUserDto{
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   phone?: string;
   role?: UserRole;
   isActive?: boolean;
}
