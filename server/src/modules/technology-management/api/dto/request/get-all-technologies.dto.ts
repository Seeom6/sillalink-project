export class GetAllTechnologiesDto {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  isFeatured?: boolean;
  difficultyLevel?: string;
}
