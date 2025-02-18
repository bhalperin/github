import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { globalConfig } from 'config/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>,
		private readonly authService: AuthService,
	) {
		super({
			clientID: config.google.clientId!,
			clientSecret: config.google.clientSecret!,
			callbackURL: config.google.callbackUrl,
			scope: ['email', 'profile'],
			passReqToCallback: false,
		});
	}

	// make sure to add this or else you won't get the refresh token
	authorizationParams(): { [key: string]: string } {
		return {
			access_type: 'offline',
			prompt: 'consent',
		};
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
		const { name, emails, photos } = profile;
		const googleUser = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken,
			refreshToken,
		};

		console.log('*** GoogleStrategy / validate, Google profile emails:', profile.emails);
		const user = await this.authService.validateGoogleUser(googleUser.email);

		if (!user) {
			done(null, {});
		}

		done(null, user as any);
	}
}
