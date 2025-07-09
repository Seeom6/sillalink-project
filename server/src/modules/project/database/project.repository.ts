import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
import { BaseMongoRepository } from '@Package/database';
@Injectable()
export class ProjectRepository extends BaseMongoRepository<ProjectDocument> {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {
    super(projectModel);
  }

  async create(createProjectDto: any): Promise<ProjectDocument> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }


  async findByName(name: string): Promise<ProjectDocument> {
    return this.projectModel.findOne({ name }).exec();
  }

  async update(id: string, updateProjectDto: any): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updateProjectDto },
        { new: true },
      )
      .exec();
  }

  async remove(id: string, ownerId: string): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, ownerId },
        { $set: { isDeleted: true } },
        { new: true },
      )
      .exec();
  }

  async addMember(id: string, memberId: string, ownerId: string): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, ownerId, isDeleted: false },
        { $addToSet: { members: memberId } },
        { new: true },
      )
      .exec();
  }

  async removeMember(id: string, memberId: string, ownerId: string): Promise<ProjectDocument> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, ownerId, isDeleted: false },
        { $pull: { members: memberId } },
        { new: true },
      )
      .exec();
  }
} 