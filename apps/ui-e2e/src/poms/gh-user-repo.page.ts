import { Locator, Page } from '@playwright/test';

export class GhUserRepoPage {
	readonly page: Page;
	readonly repo: Locator;
	readonly repoName: Locator;
	readonly collapseTrigger: Locator;
	readonly repoDetails: Locator;
	readonly parentRepoFullName: Locator;
	readonly contributors: Locator;
	readonly languages: Locator;

	constructor(page: Page) {
		this.page = page;
		this.repo = this.page.locator('gh-repo-list-item');
		this.repoName = this.repo.getByTestId('repo-name');
		this.collapseTrigger = this.repo.getByTestId('collapse-trigger');
		this.repoDetails = this.repo.getByTestId('repo-details');
		this.parentRepoFullName = this.repoDetails.getByTestId('parent-repo-full-name');
		this.contributors = this.repoDetails.getByTestId('contributors');
		this.languages = this.repoDetails.getByTestId('languages');
	}
}
