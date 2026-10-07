import { Locator } from 'vitest/browser';

import { VitestPageObjectBase } from 'core/utils/test/setup';

import { GhRepoListItemComponent } from './gh-repo-list-item.component';

export class GhRepoListItemPageObject extends VitestPageObjectBase<GhRepoListItemComponent> {
	repoName: Locator = null as unknown as Locator;
	repoDescription: Locator = null as unknown as Locator;
	collapseTrigger: Locator = null as unknown as Locator;
	repoDetails: Locator = null as unknown as Locator;
	parentRepoFullName: Locator = null as unknown as Locator;

	override render() {
		this.repoName = this.componentLocator.getByTestId('repo-name');
		this.repoDescription = this.componentLocator.getByTestId('repo-description');
		this.collapseTrigger = this.componentLocator.getByTestId('collapse-trigger');
		this.repoDetails = this.screen.getByTestId('repo-details');
		this.parentRepoFullName = this.repoDetails.getByTestId('parent-repo-full-name');
	}

	get repoNameText() {
		return this.repoName.element().textContent;
	}

	get repoDescriptionText() {
		return this.repoDescription.element().textContent;
	}

	get parentRepoFullNameText() {
		return this.parentRepoFullName.element().textContent.trim();
	}

	showRepoDetails() {
		this.repoDetails.element().dispatchEvent(new CustomEvent('show.bs.collapse'));
	}

	hideRepoDetails() {
		this.repoDetails.element().dispatchEvent(new CustomEvent('hide.bs.collapse'));
	}
}
