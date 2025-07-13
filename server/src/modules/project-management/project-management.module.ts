import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { Project, ProjectSchema } from "./database/schemas/project.schema";
import { ProjectRepository } from "./database/repositories/project.repository";
import { ProjectService } from "./services/project.service";
import { ProjectError } from "./services/project.error";
import { ProjectController } from "./api/controllers/project.controller";
import { ProjectAdminController } from "./api/controllers/project.admin.controller";
import { UserManagementModule } from "../user-management/user-management.module";
import { TechnologyManagementModule } from "../technology-management/technology-management.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    UserManagementModule,
    TechnologyManagementModule
  ],
  controllers: [
    ProjectController,
    ProjectAdminController
  ],
  providers: [
    ProjectService,
    ProjectRepository,
    ProjectError
  ],
  exports: [
    ProjectService,
    ProjectRepository
  ]
})
export class ProjectManagementModule {}
