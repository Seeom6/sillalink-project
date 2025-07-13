import { AuthAdminService } from "../../services/auth.admin.service";
import { Body, Post, Res, Get } from "@nestjs/common";
import { AuthControllerAdmin, ControllerAdmin, User } from "src/package/api";
import { LogInDto, ResetAdminPasswordDto } from "../dto/request";
import { Response } from 'express';
import { UserPayload } from "src/package/auth";
import { RateLimit } from 'src/package/security/decorators/rate-limit.decorator';
import { SkipCSRF } from 'src/package/security/decorators/skip-csrf.decorator';
import { RequiresAdminVerification, SensitiveOperation } from 'src/package/security/decorators/admin-verification.decorator';

@ControllerAdmin({
    prefix: "auth"
})
export class AuthAdminController {
    constructor(private readonly authAdminService: AuthAdminService) { }

    @Post("login")
    @SkipCSRF()
    @RateLimit({ windowMs: 900000, maxRequests: 5 }) // 5 attempts per 15 minutes
    async login(@Body() body: LogInDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authAdminService.login(body, res);
        return result;
    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) res: Response) {
        // Clear admin token cookie
        res.clearCookie('admin_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        return { message: 'Logged out successfully' };
    }



}

@AuthControllerAdmin({
    prefix: "auth"
})
export class AuthAdminHelperController{

    constructor(private readonly authAdminService: AuthAdminService) { }

    @Get("me")
    async getMe(@User() user: UserPayload) {
        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    }

    @Post("reset-admin-password")
    @RequiresAdminVerification()
    @SensitiveOperation()
    @RateLimit({ windowMs: 3600000, maxRequests: 3 }) // 3 attempts per hour
    async resetAdminPassword(
        @Body() body: ResetAdminPasswordDto
    ){
        await this.authAdminService.resetAdminPassword(body);
        return;
    }
}
