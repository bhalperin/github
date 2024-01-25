import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/users')
	getUsers() {
		return this.appService.getUsers();
	}

	@Get('/users/:login')
	getUser(@Param() params: { login: string }) {
		return this.appService.getUser(params.login);
	}
}
