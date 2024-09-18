import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhFullUserMock, GhUser, GhUserMock } from '@gh/shared';
import { of } from 'rxjs';
import { GhService } from 'services/gh.service';
import { testSetup } from 'utils/test/setup';
import { GhUserComponent } from '../gh-user/gh-user.component';
import { GhUsersComponent } from './gh-users.component';
import { GhUsersPageObject } from './gh-users.page-object';

/**
 * This component is needed until the following is fixed:
 * https://github.com/thymikee/jest-preset-angular/issues/2246
 */
@Component({
	selector: 'gh-user',
	standalone: true,
	template: ''
})
class GhUserMockComponent {
	user = input.required<GhUser>();
}

describe('GhUsersComponent', () => {
	const usersMock = [
		new GhUserMock().withId(1).data,
		new GhUserMock().withId(2).data
	] as GhUser[];
	const userMock = new GhFullUserMock().withId(1);
	const ghServiceMock = {
		getUsers: jest.fn(),
		getUser: jest.fn()
	} as Partial<GhService>;

	function setup(): { fixture: ComponentFixture<GhUsersComponent>, component: GhUsersComponent, po: GhUsersPageObject } {
		const { fixture, component } = testSetup(GhUsersComponent);

		return { fixture, component, po: new GhUsersPageObject(fixture) };
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhUsersComponent],
			providers: [
				provideHttpClientTesting,
				{ provide: GhService, useValue: ghServiceMock }
			]
		})
		.overrideComponent(GhUsersComponent, {
			remove: {
				imports: [GhUserComponent]
			},
			add: {
				imports: [GhUserMockComponent]
			}
		})
		.compileComponents();

		jest.spyOn(ghServiceMock, 'getUser').mockReturnValue(of(userMock.data));
	});

	it('should display no user cards when users are empty', () => {
		jest.spyOn(ghServiceMock, 'getUsers').mockReturnValue(of([]));

		const { fixture, component, po } = setup();

		fixture.detectChanges();

		const userElements = po.getUserElements();

		expect(userElements.length).toBe(0);
	});

	it('should display the correct number of user cards when users are non-empty', () => {
		jest.spyOn(ghServiceMock, 'getUsers').mockReturnValue(of(usersMock));

		const { fixture, component, po } = setup();

		fixture.detectChanges();

		const userElements = po.getUserElements();

		expect(userElements.length).toBe(2);
	});
});
