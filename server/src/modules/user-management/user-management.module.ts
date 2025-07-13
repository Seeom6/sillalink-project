import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAdminController } from './api/controllers/user.admin.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './database/repositories/user.repository';
import { User, UserSchema } from './database/schemas/user.schema';
import { UserError } from './services/user.error';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UserAdminController],
  providers: [UserService, UserRepository, UserError],
  exports: [UserService, UserRepository]
})
export class UserManagementModule {}
