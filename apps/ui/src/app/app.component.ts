import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { AuthKeys } from '@gh/shared';
import { AppRouter } from 'fw-extensions/app-router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'services/auth.service';
import { StoreService } from 'services/store.service';
import { NxWelcomeComponent } from './nx-welcome.component';


@Component({
	standalone: true,
	selector: 'gh-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [NxWelcomeComponent, RouterModule, RouterOutlet],
	providers: [CookieService]
})
export class AppComponent implements OnInit {
	readonly #titleService = inject(Title);
	readonly #router = inject(AppRouter);
	readonly #route = inject(ActivatedRoute);
	readonly #cookieService = inject(CookieService);
	readonly #storeService = inject(StoreService);
	readonly #authService = inject(AuthService);

	get authenticated() {
		return this.#storeService.authenticated;
	}

	ngOnInit(): void {
		const accessToken = this.#cookieService.get(AuthKeys.AccessToken);
		const refreshToken = this.#cookieService.get(AuthKeys.RefreshToken);

		this.#titleService.setTitle('Github home | nest + angular');

		if (accessToken && refreshToken) {
			this.#authService.saveCredentials({
				accessToken,
				refreshToken
			});
			this.#router.navigateToUsers();
		}
	}

	logout() {
		this.#authService.logout();
		this.#router.navigateToLogin();
	}
}
