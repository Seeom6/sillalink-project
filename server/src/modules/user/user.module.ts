import { Module } from '@nestjs/common';
import { UserAdminController } from './api/controllers/user.admin.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './entity/user.repository';
import { User, UserSchema } from './entity/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserError } from './services/user.error';
import {JwtAuthGuard} from "@Package/auth";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserAdminController],
  providers: [UserService ,UserRepository, UserError],
  exports: [UserService, UserRepository]
})
export class UserModule {}
