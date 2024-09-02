import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthKeys } from '@gh/shared';
import { CookieService } from 'ngx-cookie-service';
import { catchError, of, tap } from 'rxjs';
import { StoreService } from 'services/store.service';
import { loggedMethod } from 'utils/decorators';

type LoginResponse = {
	accessToken: string;
	refreshToken: string;
};

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	readonly #storeService = inject(StoreService);
	readonly #http = inject(HttpClient);
	readonly #cookieService = inject(CookieService);
	readonly #baseApiUrl = '/api';

	clearCredentials() {
		this.#storeService.authenticated = false;
		localStorage.removeItem(AuthKeys.AccessToken);
		localStorage.removeItem(AuthKeys.RefreshToken);
		this.#cookieService.delete(AuthKeys.AccessToken);
		this.#cookieService.delete(AuthKeys.RefreshToken);
	}

	saveCredentials(response: LoginResponse) {
		localStorage.setItem(AuthKeys.AccessToken, response.accessToken);
		localStorage.setItem(AuthKeys.RefreshToken, response.refreshToken);
		this.#storeService.authenticated = true;
	}

	get accessToken() {
		return localStorage.getItem(AuthKeys.AccessToken);
	}

	get refreshToken() {
		return localStorage.getItem(AuthKeys.RefreshToken);
	}

	@loggedMethod
	login(email: string, password: string) {
		const url = `${this.#baseApiUrl}/auth/login`;
		const credentials = { email, password };

		return this.#http.post<LoginResponse>(url, credentials)
			.pipe(
				catchError((error) => {
					console.error('http error:', error);
					this.clearCredentials();

					return of(null);
				}),
				tap(response => {
					if (response?.accessToken && response.refreshToken) {
						this.saveCredentials(response);
					}
				})
			);
	}

	@loggedMethod
	loginGoogle() {
		const url = `${this.#baseApiUrl}/auth/google/login`;

		window.location.href = url;
	}

	@loggedMethod
	logout() {
		this.clearCredentials();
	}

	@loggedMethod
	refresh(refreshToken: string) {
		const url = `${this.#baseApiUrl}/auth/refresh`;

		return this.#http.post<LoginResponse>(url, { refreshToken });
	}
}
