import { Body, Get, Post, Put, Delete, Param, Query } from '@nestjs/common';
import { AuthControllerAdmin } from 'src/package/api';
import { TechnologyService } from '../../services/technology.service';
import { CreateTechnologyDto } from '../dto/request/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/request/update-technology.dto';
import { GetAllTechnologiesDto } from '../dto/request/get-all-technologies.dto';
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '../../../user-management/interfaces/user-role.enum';

@AuthControllerAdmin({
  prefix: 'technologies'
})
export class TechnologyAdminController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologyService.create(createTechnologyDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAll(@Query() filters: GetAllTechnologiesDto) {
    return this.technologyService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findById(@Param('id') id: string) {
    return this.technologyService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async update(@Param('id') id: string, @Body() updateTechnologyDto: UpdateTechnologyDto) {
    return this.technologyService.update(id, updateTechnologyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.technologyService.delete(id);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getStats() {
    return this.technologyService.getTechnologyStats();
  }

  @Put(':id/proficiency')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateProficiency(@Param('id') id: string, @Body() body: { proficiencyLevel: number }) {
    return this.technologyService.updateProficiencyLevel(id, body.proficiencyLevel);
  }
}
