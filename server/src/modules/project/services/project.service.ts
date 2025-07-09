import { Injectable } from "@nestjs/common";
import { ProjectRepository } from "../database/project.repository";
import { ProjectDocument } from "../database/project.schema";
import { EnvironmentService } from "@Package/config";
import {parsImageUrl} from "@Package/file";

@Injectable()
export class ProjectServiceWeb {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly envService: EnvironmentService
  ) { }

  async getAll() {
    const projects: ProjectDocument[] = await this.projectRepository.aggregate({
      pipeline: [
        {
          $match: {
            isFeatured: true,
            isDeleted: {
              $ne: null
            }
          }
        },
        {
          $sample: {
            size: 6
          }
        }
      ]
    })
    projects.forEach((project) => {
      project.mainImage = parsImageUrl(project.mainImage);
      project.images = project.images.map((image)=>parsImageUrl(image))
    });
    return projects;
  }
}