import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { MediaPath } from '../types/media-path.enum';
import { ResponseInterceptor } from '@Package/api/interceptors';

@UseInterceptors(ResponseInterceptor)
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('image/:imageFolder')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Param('imageFolder') imageFolder: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      url: this.fileUploadService.getFileUrl(file.filename, imageFolder, MediaPath.IMAGE),
    };
  }
} 