import { ProjectDocument } from "@Modules/project/database/project.schema";
import {UserDocument} from "@Modules/user";

export class GetAllProjects {
    id: string;
    name: string;
    description: string;
    isFeature: boolean;
    mainImage: string;
    images: string[];
    members: {image: string, name: string,position: string}[] = [];
    constructor(project: ProjectDocument){
        this.id = project._id.toString();
        this.description = project.description;
        this.isFeature = project.isFeatured;
        this.mainImage = project.mainImage;
        this.images = project.images;
        this.name = project.name;
        (project.members as UserDocument[]).map((member: UserDocument) => {
            this.members.push({
                image: member.employee.image,
                name: member.firstName + ' ' + member.lastName,
                position: member.employee.position
            })
        })
    }
}