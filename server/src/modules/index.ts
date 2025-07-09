import { AuthModule } from "./auth";
import { ProjectModule } from "./project";
import { UserModule } from "./user";
import { EmployeeModule } from "./employee";
import { OurServiceModule } from "./our-service";
import { HealthModule } from "./health";
import { TechnologyModule } from "./technology";

export const Modules = [
  ProjectModule,
  UserModule,
  AuthModule,
  EmployeeModule,
  OurServiceModule,
  HealthModule,
  TechnologyModule
];
