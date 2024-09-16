import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthKeys } from '@gh/shared';
import { CookieService } from 'ngx-cookie-service';
import { catchError, of, tap } from 'rxjs';
import { StoreService } from 'services/store.service';
import { loggedMethod } from 'utils/decorators';

type Credentials = {
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

	get authenticated() {
		return this.#storeService.authenticated;
	}

	get credentials() {
		return {
			accessToken: this.#cookieService.get(AuthKeys.AccessToken),
			refreshToken: this.#cookieService.get(AuthKeys.RefreshToken)
		} as Credentials;
	}

	clearCredentials() {
		this.#storeService.authenticated = false;
		this.#cookieService.delete(AuthKeys.AccessToken);
		this.#cookieService.delete(AuthKeys.RefreshToken);
	}

	saveCredentials(/* response: LoginResponse */) {
		this.#storeService.authenticated = true;
	}

	get accessToken() {
		return this.credentials.accessToken;
	}

	get refreshToken() {
		return this.credentials.refreshToken;
	}

	@loggedMethod
	login(email: string, password: string) {
		const url = `${this.#baseApiUrl}/auth/login`;
		const credentials = { email, password };

		return this.#http.post(url, credentials)
			.pipe(
				catchError((error) => {
					console.error('http error:', error);
					this.clearCredentials();

					return of(null);
				}),
				tap(() => {
					if (this.accessToken && this.refreshToken) {
						this.saveCredentials();
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

		return this.#http.post(url, { refreshToken });
	}
}
