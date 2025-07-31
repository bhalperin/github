import { Locator, Page } from "@playwright/test";

export class LoginPage {
	readonly page: Page;
	readonly email: Locator;
	readonly password: Locator;
	readonly loginUserPassowrd: Locator;
	readonly spinner: Locator;
	readonly databaseConnectionError: Locator;
	readonly inavlidCredentialsError: Locator;

	constructor(page: Page) {
		this.page = page;
		this.email = this.page.getByTestId('email');
		this.password = this.page.getByTestId('password');
		this.loginUserPassowrd = this.page.getByRole('button', { name: /submit/i });
		this.spinner = this.page.getByTestId('spinner');
		this.databaseConnectionError = this.page.getByTestId('dbConnectionError');
		this.inavlidCredentialsError = this.page.getByTestId('invalidCredentials');
	}

	async goto() {
		await this.page.goto('/login');
	}

	async fill(email: string, passord: string) {
		await this.email.fill(email);
		await this.password.fill(passord);
	}

	async login() {
		await this.loginUserPassowrd.click();
	}
}
