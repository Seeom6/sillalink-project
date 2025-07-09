import { Controller, Get } from '@nestjs/common';
import { TechnologyService } from '../../services/technology.service';

@Controller('api/v1/admin/technologies')
export class TechnologyAdminController {
  constructor(
    private readonly technologyService: TechnologyService
  ) {}

  @Get()
  async getAll() {
    return { message: 'Technology controller is working!' };
  }
}
