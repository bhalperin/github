import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppRouter } from 'fw-extensions/app-router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'services/auth.service';

@Component({
	selector: 'gh-login',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	host: {
		class: 'container-fluid p-3',
	},
})
export class LoginComponent implements OnInit {
	readonly #authService = inject(AuthService);
	readonly #router = inject(AppRouter);
	loginForm = new FormGroup({
		email: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required),
	});
	protected serverError = this.#authService.serverError;
	protected connectionError = signal(false);
	protected validCredentials = signal(true);
	protected loading = signal(false);

	ngOnInit(): void {
		this.#authService.logout();
	}

	#isConnected() {
		return firstValueFrom(this.#authService.isConnected());
	}

	async submit() {
		console.log(this.loginForm.value);
		this.connectionError.set(false);
		this.validCredentials.set(true);

		if (await this.#isConnected()) {
			const login$ = this.#authService.login(this.loginForm.value.email as string, this.loginForm.value.password as string);

			this.validCredentials.set(true);
			this.loading.set(true);

			await firstValueFrom(login$);
			this.loading.set(false);
			if (this.#authService.authenticated) {
				await this.#router.navigateToUsers();
			} else if (!this.serverError()) {
				this.validCredentials.set(false);
			}
		} else {
			this.connectionError.set(true);
		}
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
