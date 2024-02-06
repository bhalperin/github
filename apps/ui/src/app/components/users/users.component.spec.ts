import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhUser, GhUserMock } from '@gh/shared';
import { of } from 'rxjs';
import { GhService } from 'services/gh.service';
import { testSetup } from 'utils/test/setup';
import { UserComponent } from '../user/user.component';
import { UsersComponent } from './users.component';
import { UsersPageObject } from './users.page-object';

/**
 * This component is needed until the following is fixed:
 * https://github.com/thymikee/jest-preset-angular/issues/2246
 */
@Component({
	selector: 'gh-user',
	standalone: true,
	template: ''
})
class UserMockComponent {
	@Input() user = {} as GhUser;
}

describe('UsersComponent', () => {
	const usersMock = [
		new GhUserMock().withId(1).data,
		new GhUserMock().withId(2).data
	] as GhUser[];
	const ghServiceMock = {
		/* getUsers: () => of(usersMock) */
		getUsers: jest.fn()
	} as Partial<GhService>;

	function setup(): { fixture: ComponentFixture<UsersComponent>, component: UsersComponent, po: UsersPageObject } {
		const { fixture, component } = testSetup(UsersComponent);

		return { fixture, component, po: new UsersPageObject(fixture) };
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UsersComponent, HttpClientTestingModule],
			providers: [
				{ provide: GhService, useValue: ghServiceMock }
			]
		})
		.overrideComponent(UsersComponent, {
			remove: {
				imports: [UserComponent]
			},
			add: {
				imports: [UserMockComponent]
			}
		})
		.compileComponents();
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
