import { DebugElement } from '@angular/core';
import { GhUsersComponent } from './gh-users.component';
import { PageObject } from 'core/utils/test/page-objects';

export class GhUsersPageObject extends PageObject<GhUsersComponent> {
	getUserElements = (): DebugElement[] => {
		return this.getDebugElementsByCss('gh-user');
	};
}
