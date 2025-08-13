import { JwtAuthGuard } from '@gh/auth';
import { User } from '@gh/prisma';
import { CreateUserDto, UpdateUserDto } from '@gh/shared';
import { loggedMethod, MICROSERVICE_NAME_USERS } from '@gh/shared/utils';
import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth-users')
export class UsersController {
	constructor(@Inject(MICROSERVICE_NAME_USERS) private readonly usersMicroservice: ClientProxy) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	@loggedMethod('API Gateway: Users controller: Get all users')
	getUsers() {
		return this.usersMicroservice.send<User[]>('get_users', {});
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	getUserById(@Param('id', ParseIntPipe) id: number) {
		return this.usersMicroservice.send<User>('get_user_by_id', id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('email/:emailAddress')
	getUserByEmail(@Param('emailAddress') email: string) {
		return this.usersMicroservice.send<User>('get_user_by_email', email);
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	createUser(@Body() data: CreateUserDto) {
		return this.usersMicroservice.send<User>('create_user', data);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
		return this.usersMicroservice.send<User>('update_user', { id, data });
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteUserById(@Param('id', ParseIntPipe) id: number) {
		return this.usersMicroservice.send<User>('delete_user_by_id', id);
	}
}
