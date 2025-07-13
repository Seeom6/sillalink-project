import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import {AuthController, AuthControllerWithToken, RefreshController} from './api/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserManagementModule } from '../user-management/user-management.module';
import {JwtAuthGuard, JWTModule} from '@Package/auth/jwt';
import { JWTStrategy } from '@Package/auth/passport/strategy/jwt.strategy';
import {AuthError} from "./services/auth.error";
import {MailService} from "@Package/services";
import { AuthAdminService } from './services/auth.admin.service';
import { AuthAdminController, AuthAdminHelperController } from './api/controllers/auth.admin.controller';
import {RefreshTokenGuard} from "@Package/auth/guards";
import {RefreshTokenStrategy} from "@Package/auth/passport/strategy/refresh-token.strategy";
import { RoleGuard } from 'src/package/auth/guards/role.guard';
import {StrategyConstant} from "@Package/auth";
import { RedisModule } from "@Package/cache";

@Module({
  imports: [
    UserManagementModule,
    PassportModule.register({ defaultStrategy: [StrategyConstant.refresh_Token, StrategyConstant.jwt, ] }),
    JWTModule,
    RedisModule,
  ],
  controllers: [
    AuthController,
    AuthControllerWithToken,
    AuthAdminController,
    AuthAdminHelperController,
    RefreshController
  ],
  providers: [
    AuthService,
    AuthAdminService,
    AuthError,
    JWTStrategy,
    MailService,
    JwtAuthGuard,
    RefreshTokenGuard,
    RefreshTokenStrategy,
    RoleGuard
  ],
  exports: [JWTStrategy, PassportModule, JwtAuthGuard, RoleGuard]
})
export class AuthSystemModule {}
