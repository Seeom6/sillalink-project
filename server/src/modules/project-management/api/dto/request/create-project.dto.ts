import { ProjectStatus, ProjectPriority } from '../../../database/schemas/project.schema';

export interface ProjectMemberDto {
  userId: string;
  role: string;
}

export interface ProjectTaskDto {
  name: string;
  description?: string;
  assignee?: string;
  dueDate?: Date;
  status?: string;
  priority?: string;
  progress?: number;
}

export class CreateProjectDto {
  name: string;
  description?: string;
  longDescription?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: Date;
  endDate?: Date;
  deadline?: Date;
  progress?: number;
  budget?: number;
  currency?: string;
  projectManager: string;
  members?: ProjectMemberDto[];
  technologies?: string[];
  tasks?: ProjectTaskDto[];
  tags?: string[];
  mainImage?: string;
  images?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  externalLink?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  notes?: string;
}
