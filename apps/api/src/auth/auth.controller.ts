import { AuthKeys } from '@gh/shared';
import { Body, Controller, Get, Post, Request, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
		res.redirect(`${process.env.WEB_APP_BASEURL}/login`);
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
			res.redirect(process.env.WEB_APP_BASEURL);
		} else {
			res.redirect(`${process.env.WEB_APP_BASEURL}/login`);
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
		req.redirect(process.env.WEB_APP_BASEURL);
	}
}
