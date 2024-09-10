import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('auth-users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	createUser(@Body() user: { email: string; password: string }) {
		const { email, password } = user;

		return this.usersService.createUser({ email, password });
	}
}
