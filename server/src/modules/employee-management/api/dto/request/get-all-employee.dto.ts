export class GetAllEmployeeDto {
   page: number = 1;
   limit: number = 10;
   department?: string;
   employmentStatus?: string;
   managerId?: string;
   search?: string;
   isActive?: boolean;
   needPagination: boolean = true;
}
