import { ProjectStatus, ProjectPriority } from '../../../database/schemas/project.schema';
import { ProjectMemberDto, ProjectTaskDto } from './create-project.dto';

export class UpdateProjectDto {
  name?: string;
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
  projectManager?: string;
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
