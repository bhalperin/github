import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GhFullUser, GhUser } from '@gh/shared';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GhService {
	readonly #http = inject(HttpClient);
	readonly #baseApiUrl = '/api';

	constructor() { }

	getUsers(): Observable<GhUser[]> {
		const url = `${this.#baseApiUrl}/users`;

		return this.#http.get<GhUser[]>(url);
	}

	getUser(login: string): Observable<GhFullUser> {
		const url = `${this.#baseApiUrl}/users/${login}`;

		return this.#http.get<GhFullUser>(url);
	}
}
