import { Locator, Page } from "@playwright/test";

export class GhUserPage {
	readonly page: Page;
	readonly userFullName: Locator;
	readonly publicRepos: Locator;

	constructor(page: Page) {
		this.page = page;
		this.userFullName = this.page.getByTestId('userFullName');
		this.publicRepos = this.page.getByTestId('publicRepos');
	}
}
