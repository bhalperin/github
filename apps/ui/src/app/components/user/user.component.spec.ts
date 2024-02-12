import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhFullUser, GhUserMock, GhUserRepo } from '@gh/shared';
import { testSetup } from 'utils/test/setup';
import { UserReposComponent } from '../user-repos/user-repos.component';
import { UserComponent } from './user.component';
import { UserPageObject } from './user.page-object';

@Component({
	selector: 'gh-user-repos',
	standalone: true,
	template: ''
})
class UserReposMockComponent {
	user = input.required<GhFullUser>();
	repos = input.required<GhUserRepo[]>();
}

describe('UserComponent', () => {
	const userMock = new GhUserMock().withId(1);

	function setup(): { fixture: ComponentFixture<UserComponent>, component: UserComponent, po: UserPageObject } {
		const { fixture, component } = testSetup(UserComponent);

		return { fixture, component, po: new UserPageObject(fixture) };
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserComponent, HttpClientTestingModule]
		})
		.overrideComponent(UserComponent, {
			remove: {
				imports: [UserReposComponent]
			},
			add: {
				imports: [UserReposMockComponent]
			}
		})
		.compileComponents();
	});

	it('should display the correct user ID in the badge', () => {
		const { fixture, component, po } = setup();

		fixture.componentRef.setInput('user', userMock.model);
		fixture.detectChanges();

		const userIdBadge = po.getUserIdBadge();

		expect((userIdBadge?.nativeElement as HTMLElement).textContent).toBe(userMock.model.id.toString());
	});
});
