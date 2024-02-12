import { DebugElement } from '@angular/core';
import { PageObject } from 'utils/test/page-objects';
import { UserComponent } from './user.component';

export class UserPageObject extends PageObject<UserComponent> {
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
