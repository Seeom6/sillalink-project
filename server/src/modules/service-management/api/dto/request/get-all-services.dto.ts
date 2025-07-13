export class GetAllServicesDto {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
