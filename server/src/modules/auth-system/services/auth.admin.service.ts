import {InjectConnection} from "@nestjs/mongoose";
import {LogInDto} from "../api/dto/request/logIn.dto";
import {Injectable} from "@nestjs/common";
import {Connection} from "mongoose";
import {MailService} from "@Package/services/email/email.service";
import {RedisService} from "@Package/cache";
import {AuthError} from "./auth.error";
import {UserRole, UserService} from "../../user-management";
import {JwtService} from "@nestjs/jwt";
import {HashService, UserPayload} from "src/package/auth";
import {ErrorCode} from "../../../common/error/error-code";
import { ResetAdminPasswordDto } from "../api/dto/request/reset-admin-password.admin";
import { Response } from 'express';

@Injectable()
export class AuthAdminService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly redisService: RedisService,
        private readonly authError: AuthError,
        @InjectConnection() private readonly connection: Connection
    ) {}

    async login(logInInfo: LogInDto, res: Response) {
        const user = await this.userService.findUserByEmail(logInInfo.email, true, true);
        if (!user) {
            this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
        }

        // Check if user is admin or operator
        if (user.role !== UserRole.ADMIN && user.role !== UserRole.OPERATOR) {
            this.authError.throw(ErrorCode.USER_NOT_ALLOW);
        }

        const isPasswordValid = await HashService.comparePassword(logInInfo.password, user.password);
        if (!isPasswordValid) {
            this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
        }

        const userPayload: UserPayload = {
            email: user.email,
            id: user._id.toString(),
            role: user.role
        };

        const accessToken = this.jwtService.sign(userPayload);

        // Set admin token cookie
        res.cookie('admin_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return {
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        };
    }

    async resetAdminPassword(resetData: ResetAdminPasswordDto) {
        const user = await this.userService.findUserByEmail(resetData.email);
        
        // Verify current password
        const isCurrentPasswordValid = await HashService.comparePassword(resetData.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
        }

        // Hash new password
        const hashedNewPassword = await HashService.hashPassword(resetData.newPassword);
        
        // Update password
        await this.userService.updateUserByEmail(resetData.email, { 
            password: hashedNewPassword 
        });

        return { message: 'Admin password reset successfully' };
    }
}
