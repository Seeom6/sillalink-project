import {UserDocument} from "@Modules/user";
import {PositionEnum} from "@Modules/employee/databases/position.enum";

export class GetAllEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  position: PositionEnum;
  department?: string;
  employmentStatus?: string;
  image: string;
  startDate: Date;
  endDate: Date;
  managerId?: string;
  projectIds?: string[];
  id: string;
  constructor(users: UserDocument) {
    this.firstName = users.firstName
    this.lastName = users.lastName
    this.email = users.email
    this.phone = users.phone
    this.role = users.role
    this.isActive = users.isActive
    this.position = users.employee.position as PositionEnum;
    this.department = users.employee.department
    this.employmentStatus = users.employee.employmentStatus
    this.image = users.employee.image
    this.startDate = users.employee.startDate
    this.endDate = users.employee.endDate ?? null
    this.managerId = users.employee.managerId
    this.projectIds = users.employee.projectIds
    this.id = users._id.toString() ;
  }
}