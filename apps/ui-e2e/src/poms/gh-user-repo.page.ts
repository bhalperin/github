import { Locator, Page } from "@playwright/test";

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
		this.repoName = this.repo.getByTestId('repoName');
		this.collapseTrigger = this.repo.getByTestId('collapseTrigger');
		this.repoDetails = this.repo.getByTestId('repoDetails');
		this.parentRepoFullName = this.repoDetails.getByTestId('parentRepoFullName');
		this.contributors = this.repoDetails.getByTestId('contributors');
		this.languages = this.repoDetails.getByTestId('languages');
	}
}
