import { Body, Get, Post, Put, Delete, Param, Query, Patch } from '@nestjs/common';
import { AuthControllerAdmin } from 'src/package/api';
import { ServiceService } from '../../services/service.service';
import { CreateServiceDto } from '../dto/request/create-service.dto';
import { UpdateServiceDto } from '../dto/request/update-service.dto';
import { GetAllServicesDto } from '../dto/request/get-all-services.dto';
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '../../../user-management/interfaces/user-role.enum';

@AuthControllerAdmin({
  prefix: 'services'
})
export class ServiceAdminController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAll(@Query() filters: GetAllServicesDto) {
    return this.serviceService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findById(@Param('id') id: string) {
    return this.serviceService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.serviceService.delete(id);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getStats() {
    return this.serviceService.getServiceStats();
  }

  @Patch(':id/order')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async incrementOrder(@Param('id') id: string) {
    return this.serviceService.incrementOrderCount(id);
  }

  @Patch(':id/rating')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateRating(@Param('id') id: string, @Body() body: { rating: number }) {
    return this.serviceService.updateRating(id, body.rating);
  }
}
