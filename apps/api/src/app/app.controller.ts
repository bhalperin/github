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
	getUserRepos(@Param() params: { login: string }, @Query() query: { pageSize: number, page: number }) {
		return this.appService.getUserRepos(params.login, query.page, query.pageSize);
	}

	@Get('/repos/:owner/:repo')
	getRepo(@Param() params: { owner: string; repo: string }) {
		return this.appService.getRepo(params.owner, params.repo);
	}

	@Get('/repos/:owner/:repo/contributors')
	getRepoContributors(@Param() params: { owner: string; repo: string }) {
		return this.appService.getRepoContributors(params.owner, params.repo);
	}

	@Get('/repos/:owner/:repo/languages')
	getRepoLanguages(@Param() params: { owner: string; repo: string }) {
		return this.appService.getRepoLanguages(params.owner, params.repo);
	}
}
