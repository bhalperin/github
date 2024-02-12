import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GhFullUser, GhUser } from '@gh/shared';
import { Observable, catchError } from 'rxjs';

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
}
