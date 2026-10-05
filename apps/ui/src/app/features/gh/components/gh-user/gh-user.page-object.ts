import { Locator } from 'vitest/browser';

import { VitestPageObjectBase } from 'core/utils/test/setup';

import { GhUserComponent } from './gh-user.component';

export class GhUserPageObject extends VitestPageObjectBase<GhUserComponent> {
	cardFront: Locator = null as unknown as Locator;
	cardBack: Locator = null as unknown as Locator;
	userIdBadge: Locator = null as unknown as Locator;
	userLogin: Locator = null as unknown as Locator;
	userFullName: Locator = null as unknown as Locator;
	flipToBackButton: Locator = null as unknown as Locator;
	flipToFrontButton: Locator = null as unknown as Locator;
	publicRepos: Locator = null as unknown as Locator;
	reposModal: Locator = null as unknown as Locator;

	override render() {
		const locator = this.componentLocator;

		this.cardFront = locator.getByCss('.card:not(.back)');
		this.cardBack = locator.getByCss('.card.back');
		this.userIdBadge = locator.getByCss('.card:not(.back) .badge');
		this.userLogin = locator.getByTestId('user-login');
		this.userFullName = locator.getByTestId('user-full-name');
		this.flipToBackButton = locator.getByTestId('flip-to-back');
		this.flipToFrontButton = locator.getByTestId('flip-to-front');
		this.publicRepos = locator.getByTestId('public-repos');
		this.reposModal = this.screen.getByCss('#repos-modal-1');
	}

	async flipToBack() {
		// TODO: figure out why this doesn't work with the high-level click() method
		// await this.flipToBackButton.click();
		(this.flipToBackButton.element() as HTMLElement).click();
	}

	async flipToFront() {
		await this.flipToFrontButton.click();
	}

	showReposModal() {
		this.reposModal.element().dispatchEvent(new CustomEvent('show.bs.modal'));
	}
}
