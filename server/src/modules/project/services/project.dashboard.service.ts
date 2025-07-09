import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../database/project.repository';
import { CreateProjectDto } from '../api/dto/request/create-project.dto';
import { UpdateProjectDto } from '../api/dto/request/update-project.dto';
import { ProjectDocument } from '../database/project.schema';
import { ProjectError } from './project.error';
import { EnvironmentService } from '@Package/config';
import { ErrorCode } from "../../../common/error/error-code";
import { UserService } from "@Modules/user";
import { User } from "@Package/api";
import { parsImageUrl } from '@Package/file';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectError: ProjectError,
    private readonly envService: EnvironmentService,
    private readonly userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<void> {
    const existingProject = await this.projectRepository.findByName(createProjectDto.name);
    if (existingProject) {
      this.projectError.throw(ErrorCode.PROJECT_ALREADY_EXISTS);
    }
    await Promise.all(createProjectDto.members.map(async (memberId) => {
      await this.userService.findById(memberId)
    }))
    await this.projectRepository.create({
      ...createProjectDto,
    });
    return;
  }

  async findOne(id: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({
      filter: {
        _id: id,
        isDeleted: false,
      },
      options: {
        populate: ['members']
      }
    });
    if (!project) {
      this.projectError.throw(ErrorCode.PROJECT_NOT_FOUND);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<void> {
    await this.findOne(id);

    if (updateProjectDto.name) {
      const existingProject = await this.projectRepository.findByName(updateProjectDto.name);
      if (existingProject && existingProject._id.toString() !== id) {
        this.projectError.throw(ErrorCode.PROJECT_ALREADY_EXISTS);
      }
    }
    await Promise.all(updateProjectDto.members.map(async (memberId) => {
      await this.userService.findById(memberId)
    }))
    const project = await this.projectRepository.update(id, updateProjectDto);
    if (!project) {
      this.projectError.throw(ErrorCode.PROJECT_NOT_FOUND);
    }
    return;
  }

  async findAll(): Promise<ProjectDocument[]> {
    const projects = await this.projectRepository.find({
      filter: {
        isDeleted: false,
      },
      options: {
        populate: [
          {
            path: 'members',
            model: User.name,
          }
        ],
      }
    });
    projects.forEach((project) => {
      project.mainImage = parsImageUrl(project.mainImage);
      project.images = project.images.map(image => parsImageUrl(image));
    });
    return projects;
  }

  async getProjectById(id: string) {
    const project = await this.projectRepository.findOne({
      filter: {
        _id: id
      }
    })
    if (!project) {
      this.projectError.throw(ErrorCode.PROJECT_NOT_FOUND)
    }
    project.mainImage = parsImageUrl(project.mainImage);
    project.images = project.images.map(image => parsImageUrl(image));
    return project
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id)
    await this.projectRepository.update(id, {
      isDeleted: new Date()
    })
    return;
  }
} 