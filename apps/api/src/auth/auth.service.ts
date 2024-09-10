import { AuthProfile } from '@gh/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findOne({ email });

		if (await bcrypt.compare(password, user?.password)) {
			const { password, ...result } = user;

			return result as Partial<PrismaUser>;
		}

		return null;
	}

	async validateGoogleUser(email: string) {
		const user = await this.usersService.findOne({ email });

		if (user) {
			const { password, ...result } = user;

			return result as Partial<PrismaUser>;
		}

		return null;
	}

	async login(user: PrismaUser) {
		const payload = { email: user.email, sub: user.id };

		console.log('*** AuthService / login, user =', user);
		return {
			accessToken: await this.jwtService.signAsync(payload, { secret: jwtConstants.accessToken.secret, expiresIn: jwtConstants.accessToken.expiry }),
			refreshToken: await this.jwtService.signAsync(payload, { secret: jwtConstants.refreshToken.secret, expiresIn: jwtConstants.refreshToken.expiry }),
		} as AuthProfile;
	}

	async refresh(refreshToken: string) {
		try {
			const decodedToken = this.jwtService.decode(refreshToken);
			console.log('*** AuthService / refresh, decodedToken =', decodedToken);

			await this.jwtService.verifyAsync(refreshToken, { secret: jwtConstants.refreshToken.secret });

			const { email, sub } = decodedToken;
			const payload = { email, sub };

			return {
				accessToken: await this.jwtService.signAsync(payload, { secret: jwtConstants.accessToken.secret, expiresIn: jwtConstants.accessToken.expiry }),
				refreshToken: await this.jwtService.signAsync(payload, { secret: jwtConstants.refreshToken.secret, expiresIn: jwtConstants.refreshToken.expiry }),
			} as AuthProfile;
		} catch {
			console.log('*** AuthService / refresh, invalid token');
			throw new UnauthorizedException();
		}
	}

	async getNewAccessToken(refreshToken: string) {
		try {
			const response = await axios.post('https://accounts.google.com/o/oauth2/token', {
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				refresh_token: refreshToken,
				grant_type: 'refresh_token',
			});

			return response.data.access_token as string;
		} catch (error) {
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
		} catch (error) {
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
