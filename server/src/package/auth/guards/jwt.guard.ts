import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyConstant } from '@Package/auth/passport/strategy/strategy.constant';
import { TokenExpiredError} from "@nestjs/jwt";
import { ErrorFactory} from "@Package/error";
import {ErrorCode} from "../../../common/error/error-code";
import {AuthErrorMessage} from "@Package/auth/error/message.error";
import {Observable} from "rxjs";
import {RedisService} from "@Package/cache";

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyConstant.jwt) {
  constructor(
    private readonly redisService: RedisService
  ) {
    super();
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if(info instanceof TokenExpiredError) {
      throw ErrorFactory.createError({
        code: ErrorCode.EXPIRED_ACCESS_TOKEN,
        message: AuthErrorMessage[ErrorCode.EXPIRED_ACCESS_TOKEN],
        errorType: "Auth Error",
      })
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}