import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			scope: ['email', 'profile'],
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

		done(null, user);
	}
}
