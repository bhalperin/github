import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { globalConfig } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.jwt.accessToken.secret,
		});
	}

	async validate(payload: any) {
		console.log('*** JwtStrategy / validate, payload =', payload);
		return { userId: payload.sub, email: payload.email };
	}
}
