import { Locator } from 'vitest/browser';

import { VitestPageObjectBase } from 'core/utils/test/setup';

import { GhUsersComponent } from './gh-users.component';

export class GhUsersPageObject extends VitestPageObjectBase<GhUsersComponent> {
	ghUsersToolbarLocator: Locator = null as unknown as Locator;
	previousPageButtonLocator: Locator = null as unknown as Locator;
	nextPageButtonLocator: Locator = null as unknown as Locator;
	flipUsersToFrontButtonLocator: Locator = null as unknown as Locator;
	ghUserLocators: Locator = null as unknown as Locator;
	ghUsersErrorLocator: Locator = null as unknown as Locator;

	override render() {
		this.ghUsersToolbarLocator = this.componentLocator.getByTestId('toolbar');
		this.previousPageButtonLocator = this.componentLocator.getByTestId('previous-page-button');
		this.nextPageButtonLocator = this.componentLocator.getByTestId('next-page-button');
		this.flipUsersToFrontButtonLocator = this.componentLocator.getByTestId('flip-users-to-front-button');
		this.ghUserLocators = this.componentLocator.getByTestId('gh-user');
		this.ghUsersErrorLocator = this.componentLocator.getByTestId('gh-users-error');
	}
}
