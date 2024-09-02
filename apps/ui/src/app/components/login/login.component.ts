import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppRouter } from 'fw-extensions/app-router';
import { delay, take, tap } from 'rxjs';
import { AuthService } from 'services/auth.service';

@Component({
	selector: 'gh-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	host: {
		class: 'container-fluid p-3'
	}
})
export class LoginComponent implements OnInit {
	readonly #authService = inject(AuthService);
	readonly #router = inject(AppRouter);
	loginForm = new FormGroup({
		email: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required)
	});
	validCredentials = signal(true);
	loading = signal(false);

	ngOnInit(): void {
		this.#authService.clearCredentials();
	}

	submit() {
		console.log(this.loginForm.value);
		const login$ = this.#authService.login(this.loginForm.value.email as string, this.loginForm.value.password as string);

		this.validCredentials.set(true);
		this.loading.set(true);
		login$
			.pipe(
				delay(1000),
				take(1),
				tap(response => {
					console.log('login response:', response);
					this.loading.set(false);
					if (!!response) {
						this.#router.navigateToUsers();
					} else {
						this.validCredentials.set(false);
					}
				})
			)
			.subscribe();
	}

	goToGoogleLogin() {
		this.#authService.loginGoogle();
	}
}
