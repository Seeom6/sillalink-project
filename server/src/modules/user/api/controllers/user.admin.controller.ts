import {Body, Get, Param, Patch, Post, Query, Res} from '@nestjs/common';
import {AuthControllerAdmin, Pagination, AllowRole, parseQuery} from 'src/package/api';
import { CreateUserDto } from '../dto/request/create-user.dto';
import {User, UserRole, UserService} from "@Modules/user"
import {GetAllUserDto} from "@Modules/user/api/dto/request/get-all-user.dto";

@AuthControllerAdmin({
   prefix: 'users',
})
export class UserAdminController {
   constructor(
      private readonly UserService: UserService
   ){}

   @Post("")
   async create(@Body() data: CreateUserDto){
      return await this.UserService.createUser(data)
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

      return await this.UserService.getAllUsers(pagination, filter)
   }

   // @Get("/find")
   // async find(@Query() filter: Partial<UserEntity>){
   //    return await this.UserService.(filter)
   // }

   @Patch(":id")
   async updateUser(@Param('id') id: string, @Body() updateData: any){
      console.log('🚀 USER CONTROLLER: Updating user', id, 'with data:', updateData);

      // Use the new updateUserById method that handles employee data
      const updatedUser = await this.UserService.updateUserById(id, updateData);
      console.log('✅ USER CONTROLLER: User updated successfully');

      return updatedUser;
   }

   @Get(":id")
   async getById(@Param('id') id:string, @Res({ passthrough: true }) res: any){
      // Add cache control headers to prevent caching of user data
      res.set({
         'Cache-Control': 'no-cache, no-store, must-revalidate',
         'Pragma': 'no-cache',
         'Expires': '0'
      });

      return await this.UserService.findById(id);
   }
}
