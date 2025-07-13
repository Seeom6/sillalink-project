// New modular system imports
import { AuthSystemModule } from "./auth-system/auth-system.module";
import { UserManagementModule } from "./user-management/user-management.module";
import { EmployeeManagementModule } from "./employee-management/employee-management.module";
import { ProjectManagementModule } from "./project-management/project-management.module";
import { TechnologyManagementModule } from "./technology-management/technology-management.module";
import { ServiceManagementModule } from "./service-management/service-management.module";
import { HealthMonitoringModule } from "./health-monitoring/health-monitoring.module";

export const Modules = [
  // Core system modules
  UserManagementModule,
  AuthSystemModule,

  // Business domain modules
  EmployeeManagementModule,
  ProjectManagementModule,
  TechnologyManagementModule,
  ServiceManagementModule,

  // System monitoring
  HealthMonitoringModule
];

// Export individual modules for direct imports
export {
  AuthSystemModule,
  UserManagementModule,
  EmployeeManagementModule,
  ProjectManagementModule,
  TechnologyManagementModule,
  ServiceManagementModule,
  HealthMonitoringModule
};
