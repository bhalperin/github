import { DebugElement } from '@angular/core';

import { PageObject } from 'core/utils/test/page-objects';

import { GhUsersComponent } from './gh-users.component';

export class GhUsersPageObject extends PageObject<GhUsersComponent> {
	getUserElements = (): DebugElement[] => {
		return this.getDebugElementsByCss('gh-user');
	};
}
