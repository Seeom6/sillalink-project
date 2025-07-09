import { MongooseModule } from "@nestjs/mongoose";
import { Project } from "./database/project.schema";
import { ProjectSchema } from "./database/project.schema";
import { ProjectService } from "./services/project.dashboard.service";
import { ProjectDashboardController } from "./api/controllers/project-dashboard.controller";
import { Module } from "@nestjs/common";
import { ProjectRepository } from "./database/project.repository";
import { ProjectError } from "./services/project.error";
import { ProjectController } from "./api/controllers/project.controller";
import { ProjectServiceWeb } from "./services/project.service";
import { UserModule } from "@Modules/user";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    UserModule
  ],
  controllers: [ProjectController, ProjectDashboardController],
  providers: [ProjectServiceWeb ,ProjectService, ProjectRepository, ProjectError],
})
export class ProjectModule {}