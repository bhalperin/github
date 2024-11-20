import { GhFullUser, GhRepoContributor, GhRepoLanguages, GhUser, GhUserRepo } from '@gh/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { messageWhenCalled } from 'utils/decorators';

@Injectable()
export class GithubService {
	readonly #baseGhApiUrl = 'https://api.github.com/';

	constructor(private httpService: HttpService) {}

	@messageWhenCalled()
	getUsers(since = 0) {
		const url = `${this.#baseGhApiUrl}users?since=${since}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhUser[]>(url)
			.pipe(map((response) => response.data));
	}

	getUser(login: string) {
		const url = `${this.#baseGhApiUrl}users/${login}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhFullUser>(url)
			.pipe(map((response) => response.data));
	}

	getUserRepos(login: string, page = 1, pageSize = 100) {
		const url = `${this.#baseGhApiUrl}users/${login}/repos?per_page=${pageSize}&page=${page}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhUserRepo[]>(url)
			.pipe(map((response) => response.data));
	}

	getRepo(owner: string, repo: string) {
		const url = `${this.#baseGhApiUrl}repos/${owner}/${repo}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhUserRepo>(url)
			.pipe(map((response) => response.data));
	}

	getRepoContributors(owner: string, repo: string) {
		const url = `${this.#baseGhApiUrl}repos/${owner}/${repo}/contributors`;

		console.log('calling:', url);
		return this.httpService
			.get<GhRepoContributor[]>(url)
			.pipe(map((response) => response.data));
	}

	getRepoLanguages(owner: string, repo: string) {
		const url = `${this.#baseGhApiUrl}repos/${owner}/${repo}/languages`;

		console.log('calling:', url);
		return this.httpService
			.get<GhRepoLanguages>(url)
			.pipe(map((response) => response.data));
	}
}
