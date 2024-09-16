import { AuthKeys } from '@gh/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { globalConfig } from '../config';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>,
		private readonly authService: AuthService
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Req() req, @Res() res: Response) {
		const response = await this.authService.login(req.user);

		res.cookie(AuthKeys.AccessToken, response.accessToken), { httpOnly: true, secure: true };
		res.cookie(AuthKeys.RefreshToken, response.refreshToken), { httpOnly: true, secure: true };

		res.send();
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@Get('logout')
	logout(@Req() req: Request, @Res() res: Response) {
		res.redirect(`${this.config.webApp.url}/login`);
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Body() body: { refreshToken: string }, @Res() res: Response) {
		const response = await this.authService.refresh(body.refreshToken);

		res.cookie(AuthKeys.AccessToken, response.accessToken), { httpOnly: true, secure: true };
		res.cookie(AuthKeys.RefreshToken, response.refreshToken), { httpOnly: true, secure: true };

		res.send();
	}

	@Get('google/login')
	@UseGuards(GoogleAuthGuard)
	googleLogin() {}

	@UseGuards(GoogleAuthGuard)
	@Get('google/callback')
	async googleLoginCallback(@Req() req, @Res() res: Response) {
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
	async getGoogleProfile(@Req() req: Request) {
		const accessToken = req.cookies[AuthKeys.AccessToken];

		if (accessToken){
			return (await this.authService.getProfile(accessToken)).data;
		}
		throw new UnauthorizedException('No access token');
	}

	@Get('google/logout')
	googleLogout(@Req() req: Request, @Res() res: Response) {
		const refreshToken = req.cookies[AuthKeys.RefreshToken];

		res.clearCookie(AuthKeys.AccessToken);
		res.clearCookie(AuthKeys.RefreshToken);
		this.authService.revokeGoogleToken(refreshToken);
		res.redirect(this.config.webApp.url);
	}
}
