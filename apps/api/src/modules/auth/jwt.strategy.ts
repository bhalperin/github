import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { globalConfig } from 'config/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.jwt.accessToken.secret as string,
			passReqToCallback: true,
		});
	}

	async validate(payload: any) {
		console.log('*** JwtStrategy / validate, payload =', payload.sub, payload.email);
		return { userId: payload.sub, email: payload.email };
	}
}
