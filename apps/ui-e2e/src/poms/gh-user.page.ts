import { Locator, Page } from '@playwright/test';

export class GhUserPage {
	readonly page: Page;
	readonly userFullName: Locator;
	readonly publicRepos: Locator;

	constructor(page: Page) {
		this.page = page;
		this.userFullName = this.page.getByTestId('user-full-name');
		this.publicRepos = this.page.getByTestId('public-repos');
	}
}
