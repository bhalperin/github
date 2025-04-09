import { AuthProfile } from '@gh/shared/models';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { globalConfig } from 'config/config';
import { User as PrismaUser } from '../../../generated/prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.getUserByEmail(email);

		if (await bcrypt.compare(password, user?.password)) {
			const { password, ...result } = user;

			return result as Partial<PrismaUser>;
		}

		return null;
	}

	async validateGoogleUser(email: string) {
		const user = await this.usersService.getUserByEmail(email);

		if (user) {
			const { password, ...result } = user;

			return result as Partial<PrismaUser>;
		}

		return null;
	}

	async login(user: PrismaUser) {
		const payload = { email: user.email, sub: user.id };

		console.log('*** AuthService / login, user =', user, 'payload =', payload);
		return {
			accessToken: await this.jwtService.signAsync(payload, { secret: this.config.jwt.accessToken.secret, expiresIn: this.config.jwt.accessToken.expiry }),
			refreshToken: await this.jwtService.signAsync(payload, { secret: this.config.jwt.refreshToken.secret, expiresIn: this.config.jwt.refreshToken.expiry }),
		} as AuthProfile;
	}

	async refresh(refreshToken: string) {
		try {
			const decodedToken = this.jwtService.decode(refreshToken);
			console.log('*** AuthService / refresh, decodedToken =', decodedToken);

			await this.jwtService.verifyAsync(refreshToken, { secret: this.config.jwt.refreshToken.secret });

			const { email, sub } = decodedToken;
			const payload = { email, sub };

			return {
				accessToken: await this.jwtService.signAsync(payload, { secret: this.config.jwt.accessToken.secret, expiresIn: this.config.jwt.accessToken.expiry }),
				refreshToken: await this.jwtService.signAsync(payload, { secret: this.config.jwt.refreshToken.secret, expiresIn: this.config.jwt.refreshToken.expiry }),
			} as AuthProfile;
		} catch {
			console.log('*** AuthService / refresh, invalid token');
			throw new UnauthorizedException();
		}
	}

	async getNewAccessToken(refreshToken: string) {
		try {
			const response = await axios.post('https://accounts.google.com/o/oauth2/token', {
				client_id: this.config.google.clientId,
				client_secret: this.config.google.clientSecret,
				refresh_token: refreshToken,
				grant_type: 'refresh_token',
			});

			return response.data.access_token as string;
		} catch {
			throw new Error('Failed to refresh the access token.');
		}
	}

	async getProfile(token: string) {
		try {
			return axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);
		} catch (error) {
			console.error('Failed to revoke the token:', error);
		}
	}

	async isTokenExpired(token: string) {
		try {
			const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
			const expiresIn = response.data.expires_in;

			if (!expiresIn || expiresIn <= 0) {
				return true;
			}
		} catch {
			return true;
		}
	}

	async revokeGoogleToken(token: string) {
		try {
			await axios.get(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
		} catch (error) {
			console.error('Failed to revoke the token:', error);
		}
	}
}
