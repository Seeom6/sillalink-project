
export class CreateProjectDto {
  name: string;

  description: string;

  members?: string[];

  images?: string[];

  isFeatured?: boolean;

  link: string;
} 