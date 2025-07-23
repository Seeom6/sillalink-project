import {
  Body,
  Get,
  Post,
  Put,
  Delete,
  Patch,
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
import { EmployeeService } from '../../services/employee.service';
import { CreateEmployeeDto } from '../dto/request/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/request/update-employee.dto';
import { GetAllEmployeesDto } from '../dto/request/get-all-employees.dto';
import { CreatePerformanceReviewDto, UpdatePerformanceReviewDto } from '../dto/request/performance-review.dto';
import { CreateEmployeeProjectDto, UpdateEmployeeProjectDto } from '../dto/request/employee-project.dto';
import { CreateTrainingDto, UpdateTrainingDto } from '../dto/request/training.dto';
import { CreateAchievementDto, UpdateAchievementDto } from '../dto/request/achievement.dto';
import { CreateDisciplinaryActionDto, UpdateDisciplinaryActionDto } from '../dto/request/disciplinary-action.dto';
import { Roles } from 'src/package/auth/decorators/roles.decorator';
import { UserRole } from '../../../user-management/interfaces/user-role.enum';
import { FileUploadService } from 'src/package/file/upload/file-upload.service';
import { MediaPath } from 'src/package/file/types/media-path.enum';

@AuthControllerAdmin({
  prefix: 'employees'
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class EmployeeAdminController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findAll(@Query() filters: GetAllEmployeesDto) {
    return this.employeeService.findAll(filters);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getStats() {
    return this.employeeService.getEmployeeStats();
  }

  @Get('featured/list')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getFeatured(@Query('limit') limit?: number) {
    return this.employeeService.getFeaturedEmployees(limit ? parseInt(limit.toString()) : 10);
  }

  @Get('department/stats')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getDepartmentStats() {
    return this.employeeService.getEmployeesByDepartment();
  }

  @Get('search/:term')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async search(@Param('term') term: string, @Query('limit') limit?: number) {
    return this.employeeService.searchEmployees(term, limit ? parseInt(limit.toString()) : 10);
  }

  @Get('manager/:managerId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getByManager(@Param('managerId') managerId: string) {
    return this.employeeService.getEmployeesByManager(managerId);
  }

  @Get('employee-id/:employeeId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    return this.employeeService.findByEmployeeId(employeeId);
  }

  @Get('email/:email')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByEmail(@Param('email') email: string) {
    return this.employeeService.findByEmail(email);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findByUserId(@Param('userId') userId: string) {
    return this.employeeService.findByUserId(userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async findById(@Param('id') id: string) {
    return this.employeeService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async delete(@Param('id') id: string) {
    return this.employeeService.delete(id);
  }

  @Patch(':id/soft-delete')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async softDelete(@Param('id') id: string) {
    return this.employeeService.softDelete(id);
  }

  @Post(':id/upload-image')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = this.fileUploadService.getFileUrl(file.filename, 'employees', MediaPath.IMAGE);

    // Update the employee with the new image URL
    const updatedEmployee = await this.employeeService.updateProfileImage(id, imageUrl);

    return {
      imageUrl,
      message: 'Employee profile image uploaded successfully',
      employee: updatedEmployee
    };
  }

  @Put(':id/technologies')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async assignTechnology(
    @Param('id') id: string, 
    @Body() body: { technologyId: string; proficiencyLevel?: number }
  ) {
    return this.employeeService.assignTechnology(id, body.technologyId, body.proficiencyLevel || 0);
  }

  @Delete(':id/technologies/:technologyId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async removeTechnology(
    @Param('id') id: string,
    @Param('technologyId') technologyId: string
  ) {
    return this.employeeService.removeTechnology(id, technologyId);
  }

  @Put(':id/technologies/:technologyId/proficiency')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateTechnologyProficiency(
    @Param('id') id: string,
    @Param('technologyId') technologyId: string,
    @Body() body: { proficiencyLevel: number }
  ) {
    return this.employeeService.updateTechnologyProficiency(id, technologyId, body.proficiencyLevel);
  }

  @Put(':id/link-user')
  @Roles(UserRole.ADMIN)
  async linkUser(
    @Param('id') id: string,
    @Body() body: { userId: string }
  ) {
    return this.employeeService.linkUserToEmployee(body.userId, id);
  }

  // Performance Review Endpoints
  @Post(':id/performance-reviews')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async addPerformanceReview(
    @Param('id') id: string,
    @Body() reviewData: CreatePerformanceReviewDto
  ) {
    return this.employeeService.addPerformanceReview(id, reviewData);
  }

  @Put(':id/performance-reviews/:reviewId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updatePerformanceReview(
    @Param('id') id: string,
    @Param('reviewId') reviewId: string,
    @Body() reviewData: UpdatePerformanceReviewDto
  ) {
    return this.employeeService.updatePerformanceReview(id, reviewId, reviewData);
  }

  @Delete(':id/performance-reviews/:reviewId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async removePerformanceReview(
    @Param('id') id: string,
    @Param('reviewId') reviewId: string
  ) {
    return this.employeeService.removePerformanceReview(id, reviewId);
  }

  // Project Endpoints
  @Post(':id/projects')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async addProject(
    @Param('id') id: string,
    @Body() projectData: CreateEmployeeProjectDto
  ) {
    return this.employeeService.addProject(id, projectData);
  }

  @Put(':id/projects/:projectId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateProject(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Body() projectData: UpdateEmployeeProjectDto
  ) {
    return this.employeeService.updateProject(id, projectId, projectData);
  }

  @Delete(':id/projects/:projectId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async removeProject(
    @Param('id') id: string,
    @Param('projectId') projectId: string
  ) {
    return this.employeeService.removeProject(id, projectId);
  }

  // Training Endpoints
  @Post(':id/trainings')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async addTraining(
    @Param('id') id: string,
    @Body() trainingData: CreateTrainingDto
  ) {
    return this.employeeService.addTraining(id, trainingData);
  }

  @Put(':id/trainings/:trainingId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateTraining(
    @Param('id') id: string,
    @Param('trainingId') trainingId: string,
    @Body() trainingData: UpdateTrainingDto
  ) {
    return this.employeeService.updateTraining(id, trainingId, trainingData);
  }

  @Delete(':id/trainings/:trainingId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async removeTraining(
    @Param('id') id: string,
    @Param('trainingId') trainingId: string
  ) {
    return this.employeeService.removeTraining(id, trainingId);
  }

  // Achievement Endpoints
  @Post(':id/achievements')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async addAchievement(
    @Param('id') id: string,
    @Body() achievementData: CreateAchievementDto
  ) {
    return this.employeeService.addAchievement(id, achievementData);
  }

  @Put(':id/achievements/:achievementId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateAchievement(
    @Param('id') id: string,
    @Param('achievementId') achievementId: string,
    @Body() achievementData: UpdateAchievementDto
  ) {
    return this.employeeService.updateAchievement(id, achievementId, achievementData);
  }

  @Delete(':id/achievements/:achievementId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async removeAchievement(
    @Param('id') id: string,
    @Param('achievementId') achievementId: string
  ) {
    return this.employeeService.removeAchievement(id, achievementId);
  }

  // Disciplinary Action Endpoints
  @Post(':id/disciplinary-actions')
  @Roles(UserRole.ADMIN)
  async addDisciplinaryAction(
    @Param('id') id: string,
    @Body() actionData: CreateDisciplinaryActionDto
  ) {
    return this.employeeService.addDisciplinaryAction(id, actionData);
  }

  @Put(':id/disciplinary-actions/:actionId')
  @Roles(UserRole.ADMIN)
  async updateDisciplinaryAction(
    @Param('id') id: string,
    @Param('actionId') actionId: string,
    @Body() actionData: UpdateDisciplinaryActionDto
  ) {
    return this.employeeService.updateDisciplinaryAction(id, actionId, actionData);
  }

  @Delete(':id/disciplinary-actions/:actionId')
  @Roles(UserRole.ADMIN)
  async removeDisciplinaryAction(
    @Param('id') id: string,
    @Param('actionId') actionId: string
  ) {
    return this.employeeService.removeDisciplinaryAction(id, actionId);
  }

  // Analytics and Reporting Endpoints
  @Get(':id/analytics')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async getEmployeeAnalytics(@Param('id') id: string) {
    return this.employeeService.getEmployeeAnalytics(id);
  }

  @Get(':id/report')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async generateEmployeeReport(@Param('id') id: string) {
    return this.employeeService.generateEmployeeReport(id);
  }

  // Attendance Management
  @Put(':id/attendance')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateAttendance(
    @Param('id') id: string,
    @Body() attendanceData: any
  ) {
    return this.employeeService.updateAttendanceSummary(id, attendanceData);
  }
}
