import {InjectConnection} from "@nestjs/mongoose";
import {LogInDto} from "../api/dto/request/logIn.dto";
import {Injectable} from "@nestjs/common";
import {Connection} from "mongoose";
import {MailService} from "@Package/services/email/email.service";
import {RedisService} from "@Package/cache";
import {AuthError} from "./auth.error";
import {UserRole, UserService} from "@Modules/user";
import {JwtService} from "@nestjs/jwt";
import {HashService, UserPayload} from "src/package/auth";
import {ErrorCode} from "../../../common/error/error-code";
import { ResetAdminPasswordDto } from "../api/dto";

@Injectable()
export class AuthAdminService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly authError: AuthError,
        private readonly redisService: RedisService,
        private readonly mailService: MailService,
        @InjectConnection() private readonly connection: Connection
    ) { }

    async login(body: LogInDto, res?: any) {
        const user = await this.userService.findUserByEmail(body.email, false);
        if (!user) {
            this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
        }

        // Allow both admin and operator roles for admin dashboard access
        if (user.role !== UserRole.ADMIN && user.role !== UserRole.OPERATOR) {
            this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await HashService.comparePassword(
            body.password,
            user.password
        );
        if (!isPasswordValid) {
            this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
        }

        const userPayload: UserPayload = {
            email: user.email,
            id: user.id,
            role: user.role
        };

        const accessToken = this.jwtService.sign(userPayload);

        // Set HTTP-only cookie if response object is available
        if (res) {
            res.cookie('admin_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/',
            });

            // Track authentication time for sensitive operations
            if (res.session) {
                res.session.lastAuthTime = Date.now();
            }
        }

        return {
            access_token: accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }


    async resetAdminPassword(body: ResetAdminPasswordDto){
        const user = await this.userService.findUserByEmail(body.email)
        const passwordHashed = await HashService.hashPassword(body.newPassword)
        await this.userService.updateUserByEmail(body.email, {password: passwordHashed})
        return

    }
}