import { Locator, Page } from '@playwright/test';

export class GhUserReposPage {
	readonly page: Page;
	readonly userName: Locator;
	readonly repoList: Locator;
	readonly repoListItems: Locator;
	readonly loadingSpinner: Locator;

	constructor(page: Page) {
		this.page = page;
		this.userName = this.page.getByTestId('user-name');
		this.repoList = this.page.getByTestId('repo-list');
		this.repoListItems = this.repoList.getByRole('listitem');
		this.loadingSpinner = this.repoList.getByTestId('loading-spinner');
	}
}
