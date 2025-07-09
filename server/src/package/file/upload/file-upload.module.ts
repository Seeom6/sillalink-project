import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, normalize } from 'path';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { ConfigService } from '@nestjs/config';
import { MediaPath } from '../types/media-path.enum';
import { EnvConfigModule, EnvironmentService } from '@Package/config';
import { existsSync, mkdirSync } from 'fs';

const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; 

const createStorageConfig = (environmentService: EnvironmentService) => {
  const maxFileSize = environmentService.get('file.maxFileSize', DEFAULT_MAX_FILE_SIZE);

  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        try {
          const uploadPath = normalize(join(process.cwd(), 'public', 'media', MediaPath.IMAGE, req.params.imageFolder));
          
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
    // limits: {
    //   fileSize: maxFileSize,
    // },
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
};

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory: createStorageConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {} 