import { ComponentFixture } from '@angular/core/testing';
import { render } from 'vitest-browser-angular';
import { Locator } from 'vitest/browser';

import { GhUserComponent } from './gh-user.component';

export class GhUserPageObject {
	componentLocator: Locator = null as unknown as Locator;
	cardFront: Locator = null as unknown as Locator;
	cardBack: Locator = null as unknown as Locator;
	userIdBadge: Locator = null as unknown as Locator;
	userLogin: Locator = null as unknown as Locator;
	userFullName: Locator = null as unknown as Locator;
	flipToBackButton: Locator = null as unknown as Locator;
	flipToFrontButton: Locator = null as unknown as Locator;
	publicRepos: Locator = null as unknown as Locator;

	render(locator: Locator) {
		this.componentLocator = locator;
		this.cardFront = this.componentLocator.getByCss('.card:not(.back)');
		this.cardBack = this.componentLocator.getByCss('.card.back');
		this.userIdBadge = this.componentLocator.getByCss('.card:not(.back) .badge');
		this.userLogin = this.componentLocator.getByTestId('user-login');
		this.userFullName = this.componentLocator.getByTestId('user-full-name');
		this.flipToBackButton = this.componentLocator.getByTestId('flip-to-back');
		this.flipToFrontButton = this.componentLocator.getByTestId('flip-to-front');
		this.publicRepos = this.componentLocator.getByTestId('public-repos');
	}

	async flipToBack() {
		await this.flipToBackButton.click();
	}

	async flipToFront() {
		await this.flipToFrontButton.click();
	}
}

export const setupTestEnvironment = async (inputs: any, providers: any[] | undefined = []) => {
	const { locator, fixture, componentClassInstance } = await render<GhUserComponent>(GhUserComponent, {
		inputs,
		providers,
	});
	const po = new GhUserPageObject();

	await po.render(locator);

	return { fixture: fixture as ComponentFixture<GhUserComponent>, componentClassInstance, po };
};
