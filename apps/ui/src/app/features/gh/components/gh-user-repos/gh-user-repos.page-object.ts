import { Locator } from 'vitest/browser';

import { VitestPageObjectBase } from 'core/utils/test/setup';

import { GhUserReposComponent } from './gh-user-repos.component';

export class GhUserReposPageObject extends VitestPageObjectBase<GhUserReposComponent> {
	userName: Locator = null as unknown as Locator;
	repoCount: Locator = null as unknown as Locator;
	repoList: Locator = null as unknown as Locator;

	override render() {
		this.userName = this.componentLocator.getByTestId('user-name');
		this.repoCount = this.componentLocator.getByTestId('repo-count');
		this.repoList = this.componentLocator.getByTestId('repo-list');
	}

	get userNameText() {
		return this.userName.element().textContent;
	}

	get repoCountText() {
		return this.repoCount.element().textContent;
	}
}
