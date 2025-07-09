import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentService } from '@Package/config';
import {StrategyConstant} from "@Package/auth/passport/strategy/strategy.constant";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, StrategyConstant.jwt) {

  constructor(
    private readonly environmentService: EnvironmentService,
  ) {
    const secretKey = environmentService.get('jwt.jwtAccessSecret');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try to extract from cookies
        (req: any) => {
          return req?.cookies?.access_token || req?.cookies?.admin_token;
        },
        // Fallback to Authorization header for backward compatibility
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secretKey,
      passReqToCallback: true,
    });

  }

  validate(req: Request, payload: any) {
    return payload
  }

}