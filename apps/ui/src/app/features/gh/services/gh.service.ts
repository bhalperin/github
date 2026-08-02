import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { catchError, EMPTY, expand, reduce, tap, throwError } from 'rxjs';

import { GhFullUser, GhRepoContributor, GhRepoLanguages, GhUser, GhUserRepo, GhUsersSearchResults } from '@gh/shared/models';
import { loggedMethod } from '@gh/shared/utils';

@Service()
export class GhService {
	readonly #http = inject(HttpClient);
	readonly #baseApiUrl = '/api/github';

	@loggedMethod()
	getUsers(since = 0) {
		const url = `${this.#baseApiUrl}/users?since=${since}`;

		return this.#http.get<GhUser[]>(url).pipe(
			catchError((error) => {
				console.error('http error:', error);
				return throwError(() => error);
			}),
		);
	}

	getUsersResource(since: Signal<number | undefined>) {
		return httpResource<GhUser[]>(() => `${this.#baseApiUrl}/users?since=${since()}`, {
			defaultValue: [],
		});
	}

	@loggedMethod()
	searchUsersResource(user: Signal<string>, page: Signal<number>) {
		return httpResource<GhUsersSearchResults>(() => (user() ? `${this.#baseApiUrl}/users/search/${user()}/${page()}` : undefined), {
			defaultValue: { incomplete_results: false, total_count: 0, items: [] },
		});
	}

	@loggedMethod()
	getUser(login: string) {
		const url = `${this.#baseApiUrl}/users/${login}`;

		return this.#http.get<GhFullUser>(url);
	}

	@loggedMethod()
	getUserRepos(login: string, page = 1, pageSize = 100) {
		const url = `${this.#baseApiUrl}/users/${login}/repos?per_page=${pageSize}&page=${page}`;

		return this.#http.get<GhUserRepo[]>(url).pipe(
			catchError(() => throwError(() => new Error(`Failed to fetch user repositories for ${login}`))),
			tap((response) => {
				response.forEach((repo) => (repo.pushed_at_date = new Date(repo.pushed_at)));
			}),
		);
	}

	@loggedMethod()
	getAllUserRepos(login: string, pageSize = 100) {
		let page = 1;

		return this.getUserRepos(login, page++, pageSize).pipe(
			catchError(() => throwError(() => new Error(`Failed to fetch user repositories for ${login}`))),
			expand((response) => (response.length ? this.getUserRepos(login, page++, pageSize) : EMPTY)),
			reduce((acc, curr) => acc.concat(...curr), [] as GhUserRepo[]),
		);
	}

	@loggedMethod()
	getRepo(owner: string, repo: string) {
		return this.#http.get<GhUserRepo>(`${this.#baseApiUrl}/repos/${owner}/${repo}`).pipe(catchError(() => throwError(() => new Error(`Failed to fetch user repository ${repo} for ${owner}`))));
	}

	@loggedMethod()
	getRepoContributors(owner: string, repo: string) {
		return this.#http
			.get<GhRepoContributor[]>(`${this.#baseApiUrl}/repos/${owner}/${repo}/contributors`)
			.pipe(catchError(() => throwError(() => new Error(`Failed to fetch contributors for user repository ${repo} of ${owner}`))));
	}

	@loggedMethod()
	getRepoLanguages(owner: string, repo: string) {
		return this.#http
			.get<GhRepoLanguages>(`${this.#baseApiUrl}/repos/${owner}/${repo}/languages`)
			.pipe(catchError(() => throwError(() => new Error(`Failed to fetch languages for user repository ${repo} of ${owner}`))));
	}
}
