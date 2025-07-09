import {Body, Get, Param, Patch, Post, Query} from '@nestjs/common';
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
   async updateUser(){
      
   }

   @Get(":id")
   async getById(@Param('id') id:string){
      return await this.UserService.findById(id);
   }
}
