import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { Project, ProjectSchema } from "./database/project.schema";
import { ProjectRepository } from "./database/project.repository";
import { ProjectService as ProjectDashboardService } from "./services/project.dashboard.service";
import { ProjectService, ProjectServiceWeb } from "./services/project.service";
import { ProjectError } from "./services/project.error";
import { ProjectController } from "./api/controllers/project.controller";
import { ProjectDashboardController } from "./api/controllers/project-dashboard.controller";
import { ProjectAdminController } from "./api/controllers/project.admin.controller";
import { UserModule } from "@Modules/user";
import { TechnologyModule } from "@Modules/technology";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    UserModule,
    TechnologyModule
  ],
  controllers: [
    ProjectController,
    ProjectDashboardController,
    ProjectAdminController
  ],
  providers: [
    ProjectService,
    ProjectServiceWeb,
    ProjectDashboardService,
    ProjectRepository,
    ProjectError
  ],
  exports: [
    ProjectService,
    ProjectServiceWeb,
    ProjectRepository
  ]
})
export class ProjectModule {}