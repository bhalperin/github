import { Locator, Page } from "@playwright/test";

export class GhUsersPage {
	readonly page: Page;
	readonly usersInPage: Locator;
	readonly firstUser: Locator;
	readonly lastUser: Locator;
	readonly next: Locator;
	readonly noUsersFound: Locator;
	readonly userCards: Locator;

	constructor(page: Page) {
		this.page = page;
		this.usersInPage = this.page.getByTestId('usersInPage');
		this.firstUser = this.page.getByTestId('firstUser');
		this.lastUser = this.page.getByTestId('lastUser');
		this.next = this.page.getByRole('button', { name: /next/i });
		this.noUsersFound = this.page.getByTestId('noUsersFound');
		this.userCards = this.page.locator('gh-user');
	}

	async goto() {
		await this.page.goto('/users');
	}
}
