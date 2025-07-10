import { JwtAuthGuard } from '@gh/auth';
import { UsersService } from '@gh/users';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Controller('auth-users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	getUsers() {
		return this.usersService.getUsers();
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	getUserById(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.getUserById(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('email/:emailAddress')
	getUserByEmail(@Param('emailAddress') email: string) {
		return this.usersService.getUserByEmail(email);
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	createUser(@Body() data: CreateUserDto) {
		return this.usersService.createUser(data);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
		return this.usersService.updateUser(id, data);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteUserById(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.deleteUserById(id);
	}
}
