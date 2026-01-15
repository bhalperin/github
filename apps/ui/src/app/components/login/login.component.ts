import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { AppRouter } from 'fw-extensions/app-router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'services/auth.service';

type LoginData = {
	email: string;
	password: string;
};

@Component({
	selector: 'gh-login',
	imports: [CommonModule, ReactiveFormsModule, FormField],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	host: {
		class: 'container-fluid p-3',
	},
})
export class LoginComponent implements OnInit {
	readonly #authService = inject(AuthService);
	readonly #router = inject(AppRouter);
	readonly loginModel = signal<LoginData>({
		email: '',
		password: '',
	});
	protected loginForm = form(this.loginModel, (form) => {
		required(form.email);
		required(form.password);
		email(form.email);
	});
	protected serverError = this.#authService.serverError;
	protected connectionError = signal(false);
	protected validCredentials = signal(true);

	ngOnInit(): void {
		this.#authService.logout();
	}

	#isConnected() {
		return firstValueFrom(this.#authService.isConnected());
	}

	async submitForm() {
		await submit(this.loginForm, async (form) => {
			console.log(this.loginForm().value());
			this.connectionError.set(false);
			this.validCredentials.set(true);

			if (await this.#isConnected()) {
				const login$ = this.#authService.login(form.email().value(), form.password().value());

				this.validCredentials.set(true);

				await firstValueFrom(login$);
				if (this.#authService.authenticated) {
					await this.#router.navigateToUsers();
				} else if (!this.serverError()) {
					this.validCredentials.set(false);
				}
			} else {
				this.connectionError.set(true);
			}
		});
	}

	async goToGoogleLogin() {
		this.connectionError.set(false);
		this.validCredentials.set(true);

		if (await this.#isConnected()) {
			this.#authService.loginGoogle();
		} else {
			this.connectionError.set(true);
		}
	}
}
