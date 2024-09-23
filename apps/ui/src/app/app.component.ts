import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
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
	readonly #storeService = inject(StoreService);
	readonly #authService = inject(AuthService);

	get authenticated() {
		return this.#storeService.authenticated;
	}

	async ngOnInit() {
		this.#titleService.setTitle('Github home | nest + angular');

		if (this.#authService.accessToken && this.#authService.refreshToken) {
			this.#authService.saveCredentials();
			await this.#router.navigateToUsers();
		}
	}

	async logout() {
		this.#authService.logout();
		await this.#router.navigateToLogin();
	}
}
