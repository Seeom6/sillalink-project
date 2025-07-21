import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, normalize } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { TechnologyAdminController } from './api/controllers/technology.admin.controller';
import { TechnologyPublicController } from './api/controllers/technology.public.controller';
import { TechnologyService } from './services/technology.service';
import { TechnologyRepository } from './database/repositories/technology.repository';
import { TechnologyError } from './services/technology.error';
import { Technology, TechnologySchema } from './database/schemas/technology.schema';
import { FileUploadModule } from 'src/package/file/upload/file-upload.module';
import { MediaPath } from 'src/package/file/types/media-path.enum';

const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const technologyMulterConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      try {
        // Create path: public/media/image/technologies
        const uploadPath = normalize(join(process.cwd(), 'public', 'media', MediaPath.IMAGE, 'technologies'));

        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      } catch (error) {
        cb(error, null);
      }
    },
    filename: (req, file, cb) => {
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop()?.toLowerCase() || '';

        if (!ALLOWED_IMAGE_TYPES.includes(extension)) {
          return cb(new Error('Invalid file extension'), null);
        }

        const sanitizedFilename = `${file.fieldname}-${uniqueSuffix}.${extension}`.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, sanitizedFilename);
      } catch (error) {
        cb(error, null);
      }
    },
  }),
  limits: {
    fileSize: DEFAULT_MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    try {
      const mimeType = file.mimetype.toLowerCase();
      const isValidType = ALLOWED_IMAGE_TYPES.some(type => mimeType.includes(type));

      if (!isValidType) {
        return cb(new Error(`Only ${ALLOWED_IMAGE_TYPES.join(', ')} files are allowed!`), false);
      }

      cb(null, true);
    } catch (error) {
      cb(error, false);
    }
  },
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Technology.name, schema: TechnologySchema }]),
    FileUploadModule,
    MulterModule.register(technologyMulterConfig)
  ],
  controllers: [TechnologyAdminController, TechnologyPublicController],
  providers: [TechnologyService, TechnologyRepository, TechnologyError],
  exports: [TechnologyService, TechnologyRepository]
})
export class TechnologyManagementModule {}
