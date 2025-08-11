import { loggedMethod } from '@gh/shared/utils';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '@gh/shared';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@MessagePattern('get_users')
	@loggedMethod('Users microservice: Get all users')
	getUsers() {
		return this.usersService.getUsers();
	}

	@MessagePattern('get_user_by_id')
	@loggedMethod('Users microservice: Get user by id')
	getUserById(id: number) {
		return this.usersService.getUserById(id);
	}

	@MessagePattern('get_user_by_email')
	@loggedMethod('Users microservice: Get user by email')
	getUserByEmail(email: string) {
		return this.usersService.getUserByEmail(email);
	}

	@MessagePattern('create_user')
	@loggedMethod('Users microservice: Create user')
	createUser(data: CreateUserDto) {
		return this.usersService.createUser(data);
	}

	@MessagePattern('update_user')
	@loggedMethod('Users microservice: Update user')
	updateUser(id: number, data: UpdateUserDto) {
		return this.usersService.updateUser(id, data);
	}

	@MessagePattern('delete_user_by_id')
	@loggedMethod('Users microservice: Delete user by id')
	deleteUserById(id: number) {
		return this.usersService.deleteUserById(id);
	}
}
