import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceController } from './api/controllers/service.controller';
import { ServiceAdminController } from './api/controllers/service.admin.controller';
import { ServiceService } from './services/service.service';
import { ServiceError } from './services/service.error';
import { Service, ServiceSchema } from './database/schemas/service.schema';
import { ServiceRepository } from './database/repositories/service.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])
  ],
  controllers: [ServiceController, ServiceAdminController],
  providers: [ServiceService, ServiceRepository, ServiceError],
  exports: [ServiceService, ServiceRepository]
})
export class ServiceManagementModule {}
