import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, of, tap } from 'rxjs';

import { AuthKeys } from '@gh/shared/models';
import { loggedMethod } from '@gh/shared/utils';

import { StoreService } from 'core/services/store/store.service';
import { publicGet, publicPost, refreshPost } from 'core/utils/api';

type Credentials = {
	accessToken: string;
	refreshToken: string;
};

@Service()
export class AuthService {
	readonly #storeService = inject(StoreService);
	readonly #http = inject(HttpClient);
	readonly #cookieService = inject(CookieService);
	readonly #baseApiUrl = '/api';
	#error = signal<HttpErrorResponse | undefined>(undefined);
	serverError = computed(() => {
		const error = this.#error();

		return error?.status && error.status >= 500;
	});

	get authenticated() {
		return this.#storeService.authenticated;
	}

	get credentials() {
		return {
			accessToken: this.#cookieService.get(AuthKeys.AccessToken),
			refreshToken: this.#cookieService.get(AuthKeys.RefreshToken),
		} as Credentials;
	}

	clearCredentials() {
		this.#storeService.authenticated = false;
		this.#cookieService.delete(AuthKeys.AccessToken);
		this.#cookieService.delete(AuthKeys.RefreshToken);
	}

	saveCredentials() {
		this.#storeService.authenticated = true;
	}

	get accessToken() {
		return this.credentials.accessToken;
	}

	get refreshToken() {
		return this.credentials.refreshToken;
	}

	get lastError() {
		return this.#error()?.status;
	}

	@loggedMethod()
	isConnected() {
		return publicGet<boolean>(this.#http, `${this.#baseApiUrl}/auth/connected`);
	}

	@loggedMethod()
	login(email: string, password: string) {
		const url = `${this.#baseApiUrl}/auth/login`;
		const credentials = { email, password };

		this.#error.set(undefined);

		return publicPost(this.#http, url, credentials).pipe(
			catchError((error) => {
				this.#error.set(error);
				if (error instanceof HttpErrorResponse) {
					console.error('*** authService http error =', error);
				} else {
					console.error('*** authService error =', error);
				}
				this.clearCredentials();

				return of(null);
			}),
			tap(() => {
				if (this.accessToken && this.refreshToken) {
					this.saveCredentials();
				}
			}),
		);
	}

	@loggedMethod()
	loginGoogle() {
		const url = `${this.#baseApiUrl}/auth/google/login`;

		window.location.href = url;
	}

	@loggedMethod()
	logout() {
		this.clearCredentials();
		this.#storeService.resetUserCards();
	}

	@loggedMethod()
	refresh(refreshToken: string) {
		const url = `${this.#baseApiUrl}/auth/refresh`;

		return refreshPost(this.#http, url, { refreshToken });
	}
}
