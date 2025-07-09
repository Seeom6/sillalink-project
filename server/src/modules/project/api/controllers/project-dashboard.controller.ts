import { ProjectService } from "@Modules/project/services/project.dashboard.service";
import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AuthControllerAdmin } from "src/package/api";
import { CreateProjectDto } from "../dto/request/create-project.dto";
import { CreateProjectValidation } from "../validation/create-project.validation.pipe";
import { GetAllProjects } from "../dto/response/get-all-porject.dto";
import { UpdateProjectDto } from "../dto/request/update-project.dto";
import { UpdateProjectValidation } from "../validation/update-project.validation.pipe";

@AuthControllerAdmin({
  prefix: "out-project"
})
export class ProjectDashboardController {
  constructor(private readonly projectService: ProjectService) { }

  @Post("")
  async createProject(@Body(CreateProjectValidation) body: CreateProjectDto) {
    return this.projectService.create(body);
  }

  @Get("")
  async getProjects() {
    const projects = await this.projectService.findAll();
    return projects.map((project)=>{ return new GetAllProjects(project)})
  }



  @Get(":id")
  async getProjectById(
    @Param() id: {id: string}
  ){
    const project = await this.projectService.getProjectById(id.id)
    return new GetAllProjects(project)
  }

  @Put(":id")
  async update(
    @Param() id: {id: string},
    @Body(UpdateProjectValidation) body: UpdateProjectDto
  ){
    return await this.projectService.update(id.id, body)
  }

  @Delete(":id")
  async delete(
    @Param() id: {id: string},
  ){
    return await this.projectService.delete(id.id)
  }
}
