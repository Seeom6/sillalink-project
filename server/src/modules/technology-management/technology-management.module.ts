import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyAdminController } from './api/controllers/technology.admin.controller';
import { TechnologyPublicController } from './api/controllers/technology.public.controller';
import { TechnologyService } from './services/technology.service';
import { TechnologyRepository } from './database/repositories/technology.repository';
import { TechnologyError } from './services/technology.error';
import { Technology, TechnologySchema } from './database/schemas/technology.schema';
import { FileUploadModule } from 'src/package/file/upload/file-upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Technology.name, schema: TechnologySchema }]),
    FileUploadModule
  ],
  controllers: [TechnologyAdminController, TechnologyPublicController],
  providers: [TechnologyService, TechnologyRepository, TechnologyError],
  exports: [TechnologyService, TechnologyRepository]
})
export class TechnologyManagementModule {}
