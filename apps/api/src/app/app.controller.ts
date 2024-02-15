import { Controller, Get, Param, Query } from '@nestjs/common';

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

	@Get('/users/:login/repos')
	getUserRepos(@Param() params: { login: string }, @Query() query: { page: number }) {
		return this.appService.getUserRepos(params.login, query.page);
	}
}
