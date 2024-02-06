import { DebugElement } from '@angular/core';
import { UsersComponent } from './users.component';
import { PageObject } from 'utils/test/page-objects';

export class UsersPageObject extends PageObject<UsersComponent> {
	getUserElements = (): DebugElement[] => {
		return this.getDebugElementsByCss('gh-user');
	}
}
