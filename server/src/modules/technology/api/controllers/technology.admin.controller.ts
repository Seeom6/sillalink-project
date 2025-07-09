import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, normalize } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MediaPath } from '@Package/file/types/media-path.enum';
import { TechnologyService } from '../../services/technology.service';
import { CreateTechnologyValidation } from '../validation/create-technology.validation.pipe';
import { UpdateTechnologyValidation } from '../validation/update-technology.validation.pipe';
import { CreateTechnologyDto } from '../dto/request/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/request/update-technology.dto';
import { GetAllTechnologiesDto } from '../dto/request/get-all-technologies.dto';
import { GetAllTechnologiesResponseDto } from '../dto/response/get-all-technologies.dto';
import { JwtAuthGuard } from '@Package/auth/jwt';
import { RoleGuard } from '@Package/auth/guards/role.guard';
import { Roles } from '@Package/auth/decorators/roles.decorator';
import { UserRole } from '@Modules/user';
import { FileUploadService } from '@Package/file/upload/file-upload.service';



@Controller('admin/technologies')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
export class TechnologyAdminController {
  constructor(
    private readonly technologyService: TechnologyService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  async getAll(@Query() query: GetAllTechnologiesDto) {
    try {
      const result = await this.technologyService.findAll(query);

      // Transform technologies using DTO to ensure proper _id serialization
      const transformedTechnologies = result.technologies.map(tech =>
        new GetAllTechnologiesResponseDto(tech)
      );

      return {
        success: true,
        data: transformedTechnologies,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        },
        message: 'Technologies retrieved successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const technology = await this.technologyService.findById(id);

      // Transform technology using DTO to ensure proper _id serialization
      const transformedTechnology = new GetAllTechnologiesResponseDto(technology);

      return {
        success: true,
        data: transformedTechnology,
        message: 'Technology retrieved successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        try {
          const uploadPath = normalize(join(process.cwd(), 'public', 'media', 'image', 'technologies'));
          console.log('📁 Creating upload directory:', uploadPath);

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
            console.log('✅ Directory created successfully');
          }

          cb(null, uploadPath);
        } catch (error) {
          console.error('❌ Directory creation error:', error);
          cb(error, null);
        }
      },
      filename: (req, file, cb) => {
        try {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = file.originalname.split('.').pop()?.toLowerCase() || '';
          const sanitizedFilename = `${file.fieldname}-${uniqueSuffix}.${extension}`;

          console.log('📝 Generated filename:', sanitizedFilename);
          cb(null, sanitizedFilename);
        } catch (error) {
          console.error('❌ Filename generation error:', error);
          cb(error, null);
        }
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
      const mimeType = file.mimetype.toLowerCase();
      const isValidType = allowedTypes.some(type => mimeType.includes(type));

      if (!isValidType) {
        return cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed!`), false);
      }

      cb(null, true);
    },
  }))
  async create(
    @Body(CreateTechnologyValidation) createTechnologyDto: CreateTechnologyDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    try {
      console.log('🔍 DEBUG: Create technology called with data:', createTechnologyDto);
      console.log('🔍 DEBUG: Uploaded file details:', image ? {
        filename: image.filename,
        originalname: image.originalname,
        mimetype: image.mimetype,
        size: image.size,
        path: image.path
      } : 'No image file');

      let imageUrl = '';

      if (image && image.filename) {
        imageUrl = this.fileUploadService.getFileUrl(image.filename, 'technologies', MediaPath.IMAGE);
        console.log('🔗 Generated image URL:', imageUrl);
      }

      const technologyData = {
        ...createTechnologyDto,
        image: imageUrl
      };

      const technology = await this.technologyService.create(technologyData);

      return {
        success: true,
        data: technology,
        message: 'Technology created successfully'
      };
    } catch (error) {
      console.error('❌ Technology creation error:', error);
      throw error;
    }
  }



  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        try {
          const uploadPath = normalize(join(process.cwd(), 'public', 'media', 'image', 'technologies'));

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
          const sanitizedFilename = `${file.fieldname}-${uniqueSuffix}.${extension}`;

          cb(null, sanitizedFilename);
        } catch (error) {
          cb(error, null);
        }
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body(UpdateTechnologyValidation) updateTechnologyDto: UpdateTechnologyDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    try {
      // 🔧 Debug: Log the received data to check projectsUsedIn
      console.log('🔍 Backend UPDATE received:', {
        id,
        projectsUsedIn: updateTechnologyDto.projectsUsedIn,
        name: updateTechnologyDto.name,
        fullDto: updateTechnologyDto
      });
      let imageUrl = updateTechnologyDto.image;

      if (image) {
        console.log('🔍 DEBUG: Update - Uploaded file details:', {
          filename: image.filename,
          originalname: image.originalname,
          mimetype: image.mimetype,
          size: image.size,
          fieldname: image.fieldname
        });

        if (!image.filename) {
          console.error('❌ ERROR: Update - image.filename is undefined');
          throw new Error('File upload failed: filename is undefined');
        }

        imageUrl = this.fileUploadService.getFileUrl(image.filename, 'technologies', MediaPath.IMAGE);
        console.log('🔗 Update - Generated image URL:', imageUrl);
      }

      // Ensure the ID from URL matches the ID in the body (if provided)
      if (updateTechnologyDto.id && updateTechnologyDto.id !== id) {
        throw new Error('ID in URL does not match ID in request body');
      }

      const technologyData = {
        ...updateTechnologyDto,
        id, // Use ID from URL parameter
        image: imageUrl
      };

      console.log('🔄 Sending to service:', {
        id,
        technologyData,
        projectsUsedIn: technologyData.projectsUsedIn
      });

      const technology = await this.technologyService.update(id, technologyData);

      console.log('✅ Service returned:', {
        id: technology._id,
        name: technology.name,
        projectsUsedIn: technology.projectsUsedIn
      });

      return {
        success: true,
        data: technology,
        message: 'Technology updated successfully'
      };
    } catch (error) {
      console.error('❌ Technology update error:', error);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      console.log('🗑️ DELETE request received for technology ID:', id);

      await this.technologyService.delete(id);

      console.log('✅ Technology deleted successfully:', id);
      return {
        success: true,
        message: 'Technology deleted successfully'
      };
    } catch (error) {
      console.error('❌ Error deleting technology:', {
        id,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  @Get('featured/list')
  async getFeatured(@Query('limit') limit?: number) {
    try {
      const technologies = await this.technologyService.findFeatured(limit || 6);

      return {
        success: true,
        data: technologies,
        message: 'Featured technologies retrieved successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/toggle-featured')
  async toggleFeatured(@Param('id') id: string) {
    try {
      const technology = await this.technologyService.findById(id);
      const updatedTechnology = await this.technologyService.update(id, {
        id,
        isFeatured: !technology.isFeatured
      });

      return {
        success: true,
        data: updatedTechnology,
        message: `Technology ${updatedTechnology.isFeatured ? 'featured' : 'unfeatured'} successfully`
      };
    } catch (error) {
      throw error;
    }
  }
}
