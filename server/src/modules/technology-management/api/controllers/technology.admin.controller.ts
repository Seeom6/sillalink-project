import {
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthControllerAdmin } from 'src/package/api';
import { TechnologyService } from '../../services/technology.service';
import { CreateTechnologyDto } from '../dto/request/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/request/update-technology.dto';
import { GetAllTechnologiesDto } from '../dto/request/get-all-technologies.dto';
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '../../../user-management/interfaces/user-role.enum';
import { FileUploadService } from 'src/package/file/upload/file-upload.service';
import { MediaPath } from 'src/package/file/types/media-path.enum';

@AuthControllerAdmin({
  prefix: 'technologies'
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TechnologyAdminController {
  constructor(
    private readonly technologyService: TechnologyService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologyService.create(createTechnologyDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAll(@Query() filters: GetAllTechnologiesDto) {
    return this.technologyService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findById(@Param('id') id: string) {
    return this.technologyService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async update(@Param('id') id: string, @Body() updateTechnologyDto: UpdateTechnologyDto) {
    return this.technologyService.update(id, updateTechnologyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.technologyService.delete(id);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getStats() {
    return this.technologyService.getTechnologyStats();
  }

  @Put(':id/proficiency')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateProficiency(@Param('id') id: string, @Body() body: { proficiencyLevel: number }) {
    return this.technologyService.updateProficiencyLevel(id, body.proficiencyLevel);
  }

  @Post(':id/upload-image')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadTechnologyImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = this.fileUploadService.getFileUrl(file.filename, 'technologies', MediaPath.IMAGE);

    // Update the technology with the new image URL
    await this.technologyService.update(id, { image: imageUrl });

    return {
      imageUrl,
      message: 'Technology image uploaded successfully'
    };
  }



  @Post('upload-icon')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadTechnologyIcon(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const iconUrl = this.fileUploadService.getFileUrl(file.filename, 'technologies/icons', MediaPath.IMAGE);

    return {
      iconUrl,
      message: 'Technology icon uploaded successfully'
    };
  }

  @Get('categories')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getCategories() {
    return this.technologyService.getCategories();
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async searchTechnologies(@Query('q') searchTerm: string, @Query('limit') limit: number = 10) {
    return this.technologyService.searchTechnologies(searchTerm, limit);
  }

  @Get('featured')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getFeaturedTechnologies(@Query('limit') limit: number = 6) {
    return this.technologyService.findFeatured(limit);
  }

  @Get('by-category/:category')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getTechnologiesByCategory(
    @Param('category') category: string,
    @Query('limit') limit: number = 10
  ) {
    return this.technologyService.findByCategory(category, limit);
  }

  @Get('by-tags')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getTechnologiesByTags(
    @Query('tags') tags: string,
    @Query('limit') limit: number = 10
  ) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.technologyService.findByTags(tagArray, limit);
  }
}
