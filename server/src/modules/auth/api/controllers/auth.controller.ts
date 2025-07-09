import {Body, Post, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '@Modules/auth';
import { SingInDto } from '../dto/request/singIn.dto';
import { LogInValidationPipe } from '../validation/log-in.validation.pipe';
import { LogInDto } from '../dto/request/logIn.dto';
import { ControllerWeb, AuthControllerWeb, User } from "src/package/api";
import {IRefreshToken, UserPayload} from 'src/package/auth';
import { ResetPasswordValidationPipe } from '../validation/reset-password.validation.pipe';
import { VerifyResetOtpValidationPipe } from '../validation/verify-reset-otp.validation.pipe';
import { CheckEmailSignIn } from '../validation/check-email-sign-in.validation.pipe';
import { Response } from "express";
import { RateLimit } from 'src/package/security/decorators/rate-limit.decorator';
import { SkipCSRF } from 'src/package/security/decorators/skip-csrf.decorator';
import {RefreshTokenGuard} from "@Package/auth/guards";
import {RefreshPayload} from "@Package/api/decorators/refresh-payload.decorator";
import {RedisKeys} from "@Common/redis.constant";
import { SingInValidationPipe } from '../validation/sing-in.validation.pipe';
import { RegisterValidationPipe } from '../validation/register.validation.pipe';
import { VerifyRegistrationOtpValidationPipe } from '../validation/verify-registration-otp.validation.pipe';

import { RegisterDto, VerifyRegistrationOtpDto, CompleteRegistrationDto } from '../dto/request/register.dto';

@ControllerWeb({prefix: "auth"})
export class AuthController {
   constructor(
      private readonly authService: AuthService,
   ){}

   @Post("check-email-sing-in")
   async checkEmailAndSendOtp(@Body(CheckEmailSignIn) body: { email: string }){
      return this.authService.checkEmailAndSendOtp(body.email)
   }
   
   @Post('log-in')
   @SkipCSRF()
   @RateLimit({ windowMs: 900000, maxRequests: 5 }) // 5 attempts per 15 minutes
   async logIn(@Body(LogInValidationPipe) logInInfo: LogInDto, @Res({passthrough: true}) res: Response ) {
      const result = await this.authService.logIn(logInInfo, res);
      return {
         accessToken: result.accessToken,
         user: result.user
      }
   }

   @Post('logout')
   async logout(@Res({passthrough: true}) res: Response) {
      // Clear authentication cookies
      res.clearCookie('access_token', {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         path: '/',
      });

      res.clearCookie('refresh_token', {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         path: '/',
      });

      return { message: 'Logged out successfully' };
   }

   @Post("register")
   @SkipCSRF()
   @RateLimit({ windowMs: 3600000, maxRequests: 3 }) // 3 registrations per hour
   async register(@Body(RegisterValidationPipe) body: RegisterDto) {
      return this.authService.initiateRegistration(body.firstName, body.lastName, body.email);
   }

   @Post("verify-registration-otp")
   async verifyRegistrationOtp(@Body(VerifyRegistrationOtpValidationPipe) body: VerifyRegistrationOtpDto) {
      return this.authService.verifyRegistrationOtp(body.email, body.otp);
   }

   @Post("complete-registration")
   async completeRegistration(@Body() body: any, @Res({passthrough: true}) res: Response) {
      console.log("🔥 DEBUG: completeRegistration called with body:", body);
      const tokens = await this.authService.completeRegistration(body.email, body.password);
      res.cookie(RedisKeys.REFRESH_TOKEN, tokens.refreshToken, {httpOnly: true});
      return {
         accessToken: tokens.accessToken
      };
   }

   @Post("test-endpoint")
   async testEndpoint(@Body() body: any) {
      console.log("🔥 DEBUG: testEndpoint called with body:", body);
      return { message: "Test endpoint works", receivedBody: body };
   }

}

@AuthControllerWeb({prefix: "auth"})
export class AuthControllerWithToken {
   constructor(
      private readonly authService: AuthService,
   ){}

   @Get("me")
   async getMe(@User() user: UserPayload) {
      return {
         id: user.id,
         email: user.email,
         role: user.role
      };
   }

   @Get("csrf-token")
   @SkipCSRF()
   async getCSRFToken(@Req() req: any, @Res({ passthrough: true }) res: Response) {
      const csrfToken = require('crypto').randomBytes(32).toString('hex');

      // Store CSRF token in session
      if (req.session) {
         req.session.csrfToken = csrfToken;
      }

      return { csrfToken };
   }

   @Post("sign-in")
   async singIn(
      @Body(SingInValidationPipe) body: SingInDto,
      @Res({passthrough: true}) res: Response ,
      @User() user: UserPayload
   ){
      const tokens = await this.authService.signIn(body)
      res.cookie(RedisKeys.REFRESH_TOKEN, tokens.refreshToken, {httpOnly: true});
      return {
         accessToken: tokens.accessToken
      }
   }

   @Post('verify-otp')
   async verifyOtp(@User() user: UserPayload, @Body() body: { otp: string }, @Res({passthrough: true}) res: Response) {
      const tokens = await this.authService.verifyOtp(user.email, body.otp);
      return {accessToken: tokens.accessToken}
   }

   @Post('verify-reset-otp')
   async verifyResetOtp(@User() user: UserPayload, @Body(VerifyResetOtpValidationPipe) body: { otp: string }) {
      return this.authService.verifyResetOtp(user.email, body.otp);
   }

   @Post('reset-password')
   async resetPassword(
      @User() user: UserPayload,
      @Body(ResetPasswordValidationPipe) body: { 
         otp: string; 
         newPassword: string;
      }
   ) {
      return await this.authService.resetPassword(user.email, body.newPassword);
   }
}

@UseGuards(RefreshTokenGuard)
@ControllerWeb({
   prefix: "auth"
})
export class RefreshController {
   constructor(
      private readonly authService: AuthService,
   ){}

   @Post('refresh')
   async refreshToken(@RefreshPayload() payload: IRefreshToken, @Res({passthrough: true}) res: Response) {
      const tokens = await this.authService.refreshToken(payload, res)
      res.cookie(RedisKeys.REFRESH_TOKEN, tokens.refreshToken, {httpOnly: true});
      return {
         accessToken: tokens.accessToken
      }
   }

   @Post("log-out")
   async logout(@RefreshPayload() payload: IRefreshToken, @Res({passthrough: true}) res: Response){
      await this.authService.logOut(payload, res)
      res.clearCookie(RedisKeys.REFRESH_TOKEN);
      return;
   }
}

