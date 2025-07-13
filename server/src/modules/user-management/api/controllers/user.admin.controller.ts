import {Body, Get, Param, Patch, Post, Query, Delete} from '@nestjs/common';
import {AuthControllerAdmin, Pagination, AllowRole, parseQuery} from 'src/package/api';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { GetAllUserDto } from '../dto/request/get-all-user.dto';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../interfaces/user-role.enum';

@AuthControllerAdmin({
   prefix: 'users',
})
export class UserAdminController {
   constructor(
      private readonly userService: UserService
   ){}

   @Post("")
   async create(@Body() data: CreateUserDto){
      return await this.userService.createUser(data)
   }

   @AllowRole([UserRole.ADMIN])
   @Get("")
   async getAllUsers(@Query() query: GetAllUserDto){
      const {pagination, myQuery} = parseQuery(query)

      // Parse role filter if provided
      let filter: { roles?: string[] } | undefined;
      if (query.role) {
         const roles = query.role.split(',').map(r => r.trim());
         filter = { roles };
      }

      return await this.userService.getAllUsers(pagination, filter)
   }

   @Get(":id")
   async getUserById(@Param('id') id: string){
      return await this.userService.findById(id);
   }

   @Patch(":id")
   async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto){
      console.log('🚀 USER CONTROLLER: Updating user', id, 'with data:', updateData);
      const updatedUser = await this.userService.updateUser(id, updateData);
      console.log('✅ USER CONTROLLER: User updated successfully');
      return updatedUser;
   }

   @Delete(":id")
   async deleteUser(@Param('id') id: string){
      return await this.userService.deleteUser(id);
   }

   @Patch(":id/activate")
   async activateUser(@Param('id') id: string){
      return await this.userService.activateUser(id);
   }

   @Patch(":id/deactivate")
   async deactivateUser(@Param('id') id: string){
      return await this.userService.deactivateUser(id);
   }

   @Get("search/:term")
   async searchUsers(@Param('term') searchTerm: string, @Query() query: any){
      const {pagination} = parseQuery(query);
      return await this.userService.searchUsers(searchTerm, pagination);
   }

   @Get("stats/overview")
   async getUserStats(){
      return await this.userService.getUserStats();
   }
}
