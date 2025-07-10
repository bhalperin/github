import { JwtAuthGuard } from '@gh/auth';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
@UseGuards(JwtAuthGuard)
export class GithubController {
	constructor(private readonly githubService: GithubService) {}

	@Get('users')
	getUsers(@Query() query: { since: number }) {
		return this.githubService.getUsers(query.since ?? 0);
	}

	@Get('users/search/:user/:page')
	searchUsers(@Param() query: { user: string; page?: number }) {
		return this.githubService.searchUsers(query.user ?? '', query.page ?? 1);
	}

	@Get('users/:login')
	getUser(@Param() params: { login: string }) {
		return this.githubService.getUser(params.login);
	}

	@Get('users/:login/repos')
	getUserRepos(@Param() params: { login: string }, @Query() query: { pageSize: number, page: number }) {
		return this.githubService.getUserRepos(params.login, query.page, query.pageSize);
	}

	@Get('repos/:owner/:repo')
	getRepo(@Param() params: { owner: string; repo: string }) {
		return this.githubService.getRepo(params.owner, params.repo);
	}

	@Get('repos/:owner/:repo/contributors')
	getRepoContributors(@Param() params: { owner: string; repo: string }) {
		return this.githubService.getRepoContributors(params.owner, params.repo);
	}

	@Get('repos/:owner/:repo/languages')
	getRepoLanguages(@Param() params: { owner: string; repo: string }) {
		return this.githubService.getRepoLanguages(params.owner, params.repo);
	}
}
