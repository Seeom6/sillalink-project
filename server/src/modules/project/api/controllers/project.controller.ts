import { ProjectServiceWeb } from "@Modules/project/services/project.service";
import { Get } from "@nestjs/common";
import { ControllerWeb } from "src/package/api";
import { GetAllProjects } from "../dto/response/get-all-porject.dto";

@ControllerWeb({
    prefix: "projects"
})
export class ProjectController {
    constructor(private readonly projectService: ProjectServiceWeb) { }

    @Get("")
    async getAllProject(){
        const projects = await this.projectService.getAll();
        return projects.map((project)=>{
            return new GetAllProjects(project)
        })
    }
}