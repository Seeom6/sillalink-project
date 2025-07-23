import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, normalize } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { EmployeeAdminController } from './api/controllers/employee.admin.controller';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './database/repositories/employee.repository';
import { EmployeeError } from './services/employee.error';
import { Employee, EmployeeSchema } from './database/schemas/employee.schema';
import { FileUploadModule } from 'src/package/file/upload/file-upload.module';
import { MediaPath } from 'src/package/file/types/media-path.enum';

const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const employeeMulterConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      try {
        // Create path: public/media/image/employees
        const uploadPath = normalize(join(process.cwd(), 'public', 'media', MediaPath.IMAGE, 'employees'));

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
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
    FileUploadModule,
    MulterModule.register(employeeMulterConfig)
  ],
  controllers: [EmployeeAdminController],
  providers: [EmployeeService, EmployeeRepository, EmployeeError],
  exports: [EmployeeService, EmployeeRepository]
})
export class EmployeeManagementModule {}
