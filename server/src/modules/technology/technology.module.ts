import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyAdminController } from './api/controllers/technology.admin.controller';
import { TechnologyService } from './services/technology.service';
import { TechnologyRepository } from './database/technology.repository';
import { TechnologyError } from './services/technology.error';
import { Technology, TechnologySchema } from './database/technology.schema';
import { FileUploadModule } from '../../package/file/upload/file-upload.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Technology.name, schema: TechnologySchema }
    ]),
    FileUploadModule,
    AuthModule
  ],
  controllers: [TechnologyAdminController],
  providers: [
    TechnologyService,
    TechnologyRepository,
    TechnologyError
  ],
  exports: [TechnologyService]
})
export class TechnologyModule {}
