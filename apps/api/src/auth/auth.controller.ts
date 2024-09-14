import { AuthKeys } from '@gh/shared';
import { Body, Controller, Get, Inject, Post, Request, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { globalConfig } from '../config';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>,
		private readonly authService: AuthService
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return await this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@Get('logout')
	logout(@Request() req, @Response() res) {
		res.redirect(`${this.config.webApp.url}/login`);
	}

	@Post('refresh')
	async refresh(@Body() body: { refreshToken: string }) {
		return await this.authService.refresh(body.refreshToken);
	}

	@Get('google/login')
	@UseGuards(GoogleAuthGuard)
	googleLogin() {}

	@UseGuards(GoogleAuthGuard)
	@Get('google/callback')
	async googleLoginCallback(@Request() req, @Response() res) {
		console.log('*** AuthController / googleLoginCallback, req.user = ', req.user);
		if (req.user?.email) {
			const response = await this.authService.login(req.user);

			res.cookie(AuthKeys.AccessToken, response.accessToken), { httpOnly: true, secure: true };
			res.cookie(AuthKeys.RefreshToken, response.refreshToken), { httpOnly: true, secure: true };
			res.redirect(this.config.webApp.url);
		} else {
			res.redirect(`${this.config.webApp.url}/login`);
		}
	}

	@UseGuards(GoogleAuthGuard)
	@Get('google/profile')
	async getGoogleProfile(@Request() req) {
		const accessToken = req.cookies['access-token'];
		if (accessToken) return (await this.authService.getProfile(accessToken)).data;
		throw new UnauthorizedException('No access token');
	}

	@Get('google/logout')
	googleLogout(@Request() req, @Response() res: Response) {
		const refreshToken = req.cookies[AuthKeys.RefreshToken];

		req.clearCookie(AuthKeys.AccessToken);
		req.clearCookie(AuthKeys.RefreshToken);
		this.authService.revokeGoogleToken(refreshToken);
		req.redirect(this.config.webApp.url);
	}
}
