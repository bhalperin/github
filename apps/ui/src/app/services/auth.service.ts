import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { StoreService } from 'services/store.service';
import { loggedMethod } from 'utils/decorators';

type LoginResponse = {
	access_token: string;
};

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	readonly #storeService = inject(StoreService);
	readonly #http = inject(HttpClient);
	readonly #baseApiUrl = '/api';

	get accessToken() {
		return localStorage.getItem('access-token');
	}

	@loggedMethod
	login(username: string, password: string): Observable<LoginResponse | null> {
		const url = `${this.#baseApiUrl}/auth/login`;
		const credentials = { username, password };

		return this.#http.post<LoginResponse>(url, credentials)
			.pipe(
				catchError((error) => {
					console.error('http error:', error);
					this.#storeService.authenticated = false;
					return of(null);
				}),
				tap(response => {
					localStorage.setItem('access-token', response?.access_token as string);
					this.#storeService.authenticated = true;
				})
			);
	}
}
