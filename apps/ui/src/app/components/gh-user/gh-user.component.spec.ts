import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GhFullUser, GhUserMock, GhUserRepo } from '@gh/shared';
import { testSetup } from 'utils/test/setup';
import { GhUserReposComponent } from '../gh-user-repos/gh-user-repos.component';
import { GhUserComponent } from './gh-user.component';
import { GhUserPageObject } from './gh-user.page-object';

@Component({
	selector: 'gh-user-repos',
	standalone: true,
	template: '',
})
class GhUserReposMockComponent {
	user = input.required<GhFullUser>();
	repos = input.required<GhUserRepo[]>();
}

describe('GhUserComponent', () => {
	const userMock = new GhUserMock().withId(1);
	const setup = () => {
		const { fixture, component } = testSetup(GhUserComponent);

		return { fixture, component, po: new GhUserPageObject(fixture) };
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhUserComponent],
			providers: [provideHttpClientTesting()],
		})
			.overrideComponent(GhUserComponent, {
				remove: {
					imports: [GhUserReposComponent],
				},
				add: {
					imports: [GhUserReposMockComponent],
				},
			})
			.compileComponents();
	});

	it('should display the correct user ID in the badge', () => {
		const { fixture, po } = setup();

		fixture.componentRef.setInput('user', userMock.model);
		fixture.detectChanges();

		const userIdBadge = po.getUserIdBadge();

		expect((userIdBadge?.nativeElement as HTMLElement).textContent).toBe(userMock.model.id.toString());
	});
});
