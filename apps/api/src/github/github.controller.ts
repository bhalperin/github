import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GithubService } from './github.service';

@Controller('github')
@UseGuards(JwtAuthGuard)
export class GithubController {
	constructor(private readonly appService: GithubService) {}

	@Get('/users')
	getUsers(@Query() query: { since: number }) {
		return this.appService.getUsers(query.since ?? 0);
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
