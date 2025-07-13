export class GetAllProjectsDto {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  projectManager?: string;
  member?: string;
  technology?: string;
  search?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}
