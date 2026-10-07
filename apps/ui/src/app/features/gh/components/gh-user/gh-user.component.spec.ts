import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, test, vi } from 'vitest';

import { GhFullUser, GhFullUserMock, GhUserMock, GhUserRepo, GhUserRepoMock } from '@gh/shared/models';

import { StoreService } from 'core/services/store/store.service';
import { vitestSetupTest } from 'core/utils/test/setup';

import { GhUserService } from '../../services/gh-user.service';
import { GhService } from '../../services/gh.service';
import { GhUserComponent } from './gh-user.component';
import { GhUserPageObject } from './gh-user.page-object';
import { provideHttpClient } from '@angular/common/http';

vi.mock('../gh-user-repos/gh-user-repos.component', async () => {
	const { Component, input } = await import('@angular/core');

	@Component({
		selector: 'gh-user-repos',
		standalone: true,
		template: '',
	})
	class GhUserReposMockComponent {
		user = input.required<GhFullUser>();
		repos = input.required<GhUserRepo[]>();
	}

	return { GhUserReposComponent: GhUserReposMockComponent };
});

describe('GhUserComponent', () => {
	const userMock = new GhUserMock().withId(1);
	const fullUserMock = new GhFullUserMock().withId(1).withName('james cook').withBlog('https://jamescook.dev').withBio('Software Engineer').withLocation('San Francisco, CA').withPublicRepos(3);
	const userReposMock = [new GhUserRepoMock().withId(1).model, new GhUserRepoMock().withId(2).model, new GhUserRepoMock().withId(3).model];
	let component: GhUserComponent;
	let po: GhUserPageObject;
	let storeService: StoreService;
	let ghService: GhService;
	let userService: GhUserService;

	beforeAll(() => {
		const style = document.createElement('style');

		style.innerHTML = `
			* {
				transition-duration: 0s !important;
			}
			`;
		document.head.appendChild(style);
	});

	beforeEach(async () => {
		({ componentClassInstance: component, po } = await vitestSetupTest(GhUserPageObject, GhUserComponent, { user: userMock.model }, [
			provideHttpClient(),
			provideHttpClientTesting(),
			GhUserService,
			StoreService,
		]));
		storeService = TestBed.inject(StoreService);
		ghService = TestBed.inject(GhService);
		userService = TestBed.inject(GhUserService);
	});

	afterEach(() => {
		document.body.removeAttribute('class');
		document.body.removeAttribute('style');

		/// TODO: find an elegant way to hide bootstrap components (e.g. modal dialog, tooltip) without removing them
		document.body.replaceChildren();
	});

	describe('Card front', () => {
		test('data displayed on the card should be correct', async () => {
			const user = component.user();

			await expect.element(po.userIdBadge).toHaveTextContent(user.id.toString());
			await expect.element(po.userLogin).toHaveTextContent(user.login);
		});
	});

	describe('Card back', () => {
		test('data displayed on the card should be correct', async () => {
			const flipUserSpy = vi.spyOn(component, 'flipUser');
			const getUserSpy = vi.spyOn(ghService, 'getUser').mockReturnValue(of(fullUserMock.model));

			await po.flipToBack();

			expect(component.flipped()).toBe(true);
			expect(flipUserSpy).toHaveBeenCalled();
			await vi.waitFor(() => {
				expect(getUserSpy).toHaveBeenCalledOnce();
			});

			const fullUser = component.fullUser() as GhFullUser;

			expect(fullUser).toBeTruthy();
			await expect.element(po.publicRepos).toHaveTextContent(fullUser.public_repos);
			await expect.element(po.userFullName).toHaveTextContent(fullUser.name);
		});

		describe('when user has repos', () => {
			test('public repos button should be displayed', async () => {
				const getUserSpy = vi.spyOn(ghService, 'getUser').mockReturnValue(of(fullUserMock.model));

				await po.flipToBack();

				await vi.waitFor(() => {
					expect(getUserSpy).toHaveBeenCalledOnce();
				});
				await expect.element(po.publicRepos).toBeInTheDocument();
				await expect(po.publicRepos.element().textContent).toBe(fullUserMock.model.public_repos.toString());
			});

			test('clicking user repos button should fetch all user repos', async () => {
				const getUserSpy = vi.spyOn(ghService, 'getUser').mockReturnValue(of(fullUserMock.model));
				const allReposSpy = vi.spyOn(ghService, 'getAllUserRepos').mockReturnValue(of(userReposMock));

				await po.flipToBack();

				await vi.waitFor(() => {
					expect(getUserSpy).toHaveBeenCalledOnce();
				});

				po.showReposModal();

				expect(allReposSpy).toHaveBeenCalledOnce();
			});
		});

		describe('when user has no repos', () => {
			test('public repos button should not be displayed', async () => {
				const getUserSpy = vi.spyOn(ghService, 'getUser').mockReturnValue(of(fullUserMock.withPublicRepos(0).model));

				await po.flipToBack();

				await vi.waitFor(() => {
					expect(getUserSpy).toHaveBeenCalledOnce();
				});
				await expect.element(po.publicRepos).not.toBeInTheDocument();
			});
		});
	});

	describe('Flipped signal', () => {
		describe('when flipped state is false on component load', () => {
			test('should be initially false, then true clicking the flip button, then false when clicking the flip button again', async () => {
				expect(component.flipped()).toBe(false);

				await po.flipToBack();
				await po.flipToFront();

				expect(component.flipped()).toBe(false);
			});

			test('should be false if flip all cards event is fired', async () => {
				await po.flipToBack();

				userService.updateCardFaces(true);

				expect(component.flipped()).toBe(false);
			});
		});

		describe('when flipped state is true on component load', () => {
			test('should be true', () => {
				const spy = vi.spyOn(storeService, 'isUserCardFlipped').mockReturnValue(true);

				component.ngOnInit();

				expect(spy).toHaveBeenCalledOnce();
				expect(component.flipped()).toBe(true);
			});
		});
	});
});
