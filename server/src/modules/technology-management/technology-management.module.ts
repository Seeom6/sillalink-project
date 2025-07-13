import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyAdminController } from './api/controllers/technology.admin.controller';
import { TechnologyService } from './services/technology.service';
import { TechnologyRepository } from './database/repositories/technology.repository';
import { TechnologyError } from './services/technology.error';
import { Technology, TechnologySchema } from './database/schemas/technology.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Technology.name, schema: TechnologySchema }])
  ],
  controllers: [TechnologyAdminController],
  providers: [TechnologyService, TechnologyRepository, TechnologyError],
  exports: [TechnologyService, TechnologyRepository]
})
export class TechnologyManagementModule {}
