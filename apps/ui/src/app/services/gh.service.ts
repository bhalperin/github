import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GhFullUser, GhRepoContributor, GhRepoLanguages, GhUser, GhUserRepo } from '@gh/shared';
import { EMPTY, Observable, catchError, expand, reduce, tap, throwError } from 'rxjs';
import { loggedMethod } from 'utils/decorators';

@Injectable({
	providedIn: 'root',
})
export class GhService {
	readonly #http = inject(HttpClient);
	readonly #baseApiUrl = '/api';

	@loggedMethod
	getUsers(since = 0): Observable<GhUser[]> {
		const url = `${this.#baseApiUrl}/users?since=${since}`;

		return this.#http.get<GhUser[]>(url).pipe(
			catchError((error) => {
				console.error('http error:', error);
				return throwError(() => error);
			}),
		);
	}

	@loggedMethod
	getUser(login: string): Observable<GhFullUser> {
		const url = `${this.#baseApiUrl}/users/${login}`;

		return this.#http.get<GhFullUser>(url);
	}

	getUserRepos(
		login: string,
		page = 1,
		pageSize = 100,
	): Observable<GhUserRepo[]> {
		const url = `${this.#baseApiUrl}/users/${login}/repos?per_page=${pageSize}&page=${page}`;

		return this.#http
			.get<GhUserRepo[]>(url)
			.pipe(
				tap((response) =>
					response.forEach(
						(repo) =>
							(repo.pushed_at_date = new Date(repo.pushed_at)),
					),
				),
			);
	}

	@loggedMethod
	getAllUserRepos(login: string): Observable<GhUserRepo[]> {
		let page = 1;

		return this.getUserRepos(login, page++).pipe(
			expand((response) =>
				response.length ? this.getUserRepos(login, page++) : EMPTY,
			),
			reduce((acc, curr) => acc.concat(...curr), [] as GhUserRepo[]),
		);
	}

	@loggedMethod
	getRepo(owner: string, repo: string): Observable<GhUserRepo> {
		return this.#http.get<GhUserRepo>(`${this.#baseApiUrl}/repos/${owner}/${repo}`);
	}

	@loggedMethod
	getRepoContributors(owner: string, repo: string): Observable<GhRepoContributor[]> {
		return this.#http.get<GhRepoContributor[]>(`${this.#baseApiUrl}/repos/${owner}/${repo}/contributors`);
	}

	@loggedMethod
	getRepoLanguages(owner: string, repo: string): Observable<GhRepoLanguages> {
		return this.#http.get<GhRepoLanguages>(`${this.#baseApiUrl}/repos/${owner}/${repo}/languages`);
	}
}
