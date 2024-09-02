import { DebugElement } from '@angular/core';
import { PageObject } from 'utils/test/page-objects';
import { GhUserComponent } from './gh-user.component';

export class GhUserPageObject extends PageObject<GhUserComponent> {
	getCardFront = (): DebugElement => {
		return this.getDebugElementByCss('.card:not(.back)');
	}

	getCardBack = (): DebugElement => {
		return this.getDebugElementByCss('.card.back');
	}

	getUserIdBadge = (): DebugElement => {
		return this.getDebugElementByCss('.card:not(.back) .badge');
	}
}
