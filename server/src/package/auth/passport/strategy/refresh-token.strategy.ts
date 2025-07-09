import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {IRefreshToken, StrategyConstant} from "@Package/auth";
import { EnvironmentService } from "@Package/config";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { RedisKeys } from "../../../../common/redis.constant";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, StrategyConstant.refresh_Token) {

  constructor(
    private readonly environmentService: EnvironmentService,
  ) {
    const secretKey = environmentService.get('jwt.jwtRefreshSecret');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors<Request>([
        (req: Request) => {
          return req?.cookies[RedisKeys.REFRESH_TOKEN]
        },
      ]) ,
      ignoreExpiration: false,
      secretOrKey: secretKey,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IRefreshToken) {
    req[RedisKeys.REFRESH_TOKEN] = payload;
    return payload;
  }
}