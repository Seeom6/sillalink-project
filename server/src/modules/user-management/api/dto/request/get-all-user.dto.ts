export class GetAllUserDto {
   page: number = 1;
   limit: number = 10;
   role?: string; // comma-separated roles
   search?: string;
   isActive?: boolean;
   needPagination: boolean = true;
}
