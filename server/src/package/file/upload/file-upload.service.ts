import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import { join, normalize } from 'path';
import { MediaPath } from '../types/media-path.enum';
import { existsSync, unlink } from 'fs';
import {EnvironmentService} from "@Package/config";

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  constructor(private readonly configService: EnvironmentService) {}

  getFileUrl(filename: string, folder: string, mediaPath: MediaPath): string {
    return `media/${mediaPath}/${folder}/${filename}`.replace(/\\/g, '/');
  }

  getFilePath(filename: string): string {
    return normalize(join(process.cwd(), 'media', filename));
  }

  async deleteFile(filename: string): Promise<void> {
    const path = this.getFilePath(filename);
    if (!existsSync(path)) {
      throw new Error(`File ${filename} does not exist`);
    }
    
    return new Promise((resolve, reject) => {
      unlink(path, (err) => {
        if (err) {
          this.logger.error(`Error deleting file ${filename}:`, err);
          reject(err);
        } else {
          this.logger.log(`File ${filename} deleted successfully`);
          resolve();
        }
      });
    });
  }
} 