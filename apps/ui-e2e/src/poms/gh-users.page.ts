import { Locator, Page } from "@playwright/test";

export class GhUsersPage {
	readonly page: Page;
	readonly usersInPage: Locator;
	readonly firstUser: Locator;
	readonly lastUser: Locator;
	readonly next: Locator;
	readonly noUsersFound: Locator;

	constructor(page: Page) {
		this.page = page;
		this.usersInPage = this.page.getByTestId('usersInPage');
		this.firstUser = this.page.getByTestId('firstUser');
		this.lastUser = this.page.getByTestId('lastUser');
		this.next = this.page.getByRole('button', { name: /next/i });
		this.noUsersFound = this.page.getByTestId('noUsersFound');
	}

	async goto() {
		await this.page.goto('/users');
	}
}
