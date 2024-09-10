import { GhFullUser, GhRepoContributor, GhRepoLanguages, GhUser, GhUserRepo } from '@gh/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class GithubService {
	readonly #baseGhApiUrl = 'https://api.github.com/';

	constructor(private httpService: HttpService) {}

	getData(): { message: string } {
		return { message: 'Hello API' };
	}

	getUsers(since = 0): Observable<GhUser[]> {
		const url = `${this.#baseGhApiUrl}users?since=${since}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhUser[]>(url)
			.pipe(map((response) => response.data));
	}

	getUser(login: string): Observable<GhFullUser> {
		const url = `${this.#baseGhApiUrl}users/${login}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhFullUser>(url)
			.pipe(map((response) => response.data));
	}

	getUserRepos(
		login: string,
		page = 1,
		pageSize = 100,
	): Observable<GhUserRepo[]> {
		const url = `${this.#baseGhApiUrl}users/${login}/repos?per_page=${pageSize}&page=${page}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhUserRepo[]>(url)
			.pipe(map((response) => response.data));
	}

	getRepo(owner: string, repo: string): Observable<GhUserRepo> {
		const url = `${this.#baseGhApiUrl}repos/${owner}/${repo}`;

		console.log('calling:', url);
		return this.httpService
			.get<GhUserRepo>(url)
			.pipe(map((response) => response.data));
	}

	getRepoContributors(
		owner: string,
		repo: string,
	): Observable<GhRepoContributor[]> {
		const url = `${this.#baseGhApiUrl}repos/${owner}/${repo}/contributors`;

		console.log('calling:', url);
		return this.httpService
			.get<GhRepoContributor[]>(url)
			.pipe(map((response) => response.data));
	}

	getRepoLanguages(
		owner: string,
		repo: string,
	): Observable<GhRepoLanguages> {
		const url = `${this.#baseGhApiUrl}repos/${owner}/${repo}/languages`;

		console.log('calling:', url);
		return this.httpService
			.get<GhRepoLanguages>(url)
			.pipe(map((response) => response.data));
	}
}
