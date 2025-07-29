import { AuthService, GoogleAuthGuard, JwtAuthGuard, LocalAuthGuard } from '@gh/auth';
import { globalConfig } from '@gh/config';
import { User as PrismaUser } from '@gh/prisma';
import { AuthKeys } from '@gh/shared/models';
import { loggedMethod } from '@gh/shared/utils';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto } from './dtos';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>,
		private readonly authService: AuthService,
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiBody({ type: LoginDto })
	@loggedMethod('Log in with user/password')
	async login(@Body() user: LoginDto, @Res() res: Response) {
		const response = await this.authService.login(user as PrismaUser);

		res.cookie(AuthKeys.AccessToken, response.accessToken, { secure: true });
		res.cookie(AuthKeys.RefreshToken, response.refreshToken, { secure: true });

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

		res.cookie(AuthKeys.AccessToken, response.accessToken, { secure: true });
		res.cookie(AuthKeys.RefreshToken, response.refreshToken, { secure: true });

		res.send();
	}

	@Get('google/login')
	@UseGuards(GoogleAuthGuard)
	@loggedMethod('Log in with Google credentials')
	googleLogin() {
		console.log('Log in with Google credentials');
	}

	@UseGuards(GoogleAuthGuard)
	@Get('google/callback')
	async googleLoginCallback(@Req() req: any, @Res() res: Response) {
		console.log('*** AuthController / googleLoginCallback, req.user = ', req.user);
		if (req.user?.email) {
			try {
				const response = await this.authService.login(req.user);

				res.cookie(AuthKeys.AccessToken, response.accessToken, { secure: true });
				res.cookie(AuthKeys.RefreshToken, response.refreshToken, { secure: true });
				res.redirect(this.config.webApp.url as string);
			} catch (error) {
				console.error('Error during Google login callback:', error);
				res.redirect(`${this.config.webApp.url}/login?error=google`);
			}
		} else {
			res.redirect(`${this.config.webApp.url}/login`);
		}
	}

	@UseGuards(GoogleAuthGuard)
	@Get('google/profile')
	async getGoogleProfile(@Req() req: Request) {
		const accessToken = req.cookies[AuthKeys.AccessToken];

		if (accessToken) {
			return (await this.authService.getProfile(accessToken))?.data;
		}
		throw new UnauthorizedException('No access token');
	}

	@Get('google/logout')
	googleLogout(@Req() req: Request, @Res() res: Response) {
		const refreshToken = req.cookies[AuthKeys.RefreshToken];

		res.clearCookie(AuthKeys.AccessToken);
		res.clearCookie(AuthKeys.RefreshToken);
		this.authService.revokeGoogleToken(refreshToken);
		res.redirect(this.config.webApp.url as string);
	}
}
