import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GhFullUser, GhUser, GhUserRepo } from '@gh/shared';
import { EMPTY, Observable, catchError, expand, reduce } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GhService {
	readonly #http = inject(HttpClient);
	readonly #baseApiUrl = '/api';

	getUsers(): Observable<GhUser[]> {
		const url = `${this.#baseApiUrl}/users`;

		return this.#http.get<GhUser[]>(url).pipe(
			catchError((error) => {
				console.error('http error:', error);
				return [];
			}),
		);
	}

	getUser(login: string): Observable<GhFullUser> {
		const url = `${this.#baseApiUrl}/users/${login}`;

		return this.#http.get<GhFullUser>(url);
	}

	getUserRepos(login: string, page = 1, pageSize = 100): Observable<GhUserRepo[]> {
		const url = `${this.#baseApiUrl}/users/${login}/repos?per_page=${pageSize}&page=${page}`;

		return this.#http.get<GhUserRepo[]>(url);
	}

	getAllUserRepos(login: string): Observable<GhUserRepo[]> {
		let page = 1;

		return this.getUserRepos(login, page++).pipe(
			expand((response) =>
				response.length ? this.getUserRepos(login, page++) : EMPTY,
			),
			reduce((acc, curr) => acc.concat(...curr), [] as GhUserRepo[]),
		);
	}
}
