import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, test, vi } from 'vitest';

import { GhUser, GhUserMock } from '@gh/shared/models';

import { createResourceMock, createResourceMockWithError } from 'core/utils/test/mock/resource-mock';
import { vitestSetupTest } from 'core/utils/test/setup';

import { GhUserService } from '../../services/gh-user.service';
import { GhService } from '../../services/gh.service';
import { GhUsersComponent } from './gh-users.component';
import { GhUsersPageObject } from './gh-users.page-object';

describe('GhUsersComponent', () => {
	const usersPageMock = [new GhUserMock().withId(1).data, new GhUserMock().withId(2).data, new GhUserMock().withId(3).data] as GhUser[];
	let httpTestingController: HttpTestingController;
	let ghUserService: GhUserService;
	let ghServiceMock: Partial<GhService>;
	let componentInstance: GhUsersComponent;
	let po: GhUsersPageObject;

	function getUsersImplementation(response: GhUser[], withError = false) {
		if (withError) {
			return () => createResourceMockWithError<GhUser[]>([]);
		}

		return () => createResourceMock<GhUser[]>(response);
	}

	async function setup(response: GhUser[], withError = false) {
		ghServiceMock = {
			getUsersResource: vi.fn().mockImplementation(getUsersImplementation(response, withError)),
			searchUsersResource: vi.fn(),
		};

		({ componentClassInstance: componentInstance, po } = await vitestSetupTest(GhUsersPageObject, GhUsersComponent, {}, [
			provideHttpClient(),
			provideHttpClientTesting(),
			GhUserService,
			{ provide: GhService, useValue: ghServiceMock },
		]));
		httpTestingController = TestBed.inject(HttpTestingController);
		ghUserService = TestBed.inject(GhUserService);
	}

	afterEach(() => {
		httpTestingController?.verify();
	});

	describe('when get users api call fails', () => {
		beforeEach(async () => {
			await setup([], true);
		});

		test('should hide the toolbar and display an error message when the users request fails', async () => {
			await expect.element(po.ghUsersToolbarLocator).not.toBeInTheDocument();
			await expect.element(po.ghUsersErrorLocator).toBeVisible();
		});
	});

	describe('when get users api call is successful', () => {
		describe('when there are no Github users', () => {
			beforeEach(async () => {
				await setup([]);
			});

			test('should display no user cards', async () => {
				await expect(po.ghUserLocators).toHaveLength(0);
			});

			test('should disable the "flip users to front" button', async () => {
				await expect.element(po.flipUsersToFrontButtonLocator).toBeDisabled();
			});
		});

		describe('when there are Github users', () => {
			beforeEach(async () => {
				await setup(usersPageMock);
			});

			test('should display the correct list of user cards', async () => {
				await expect.element(po.ghUserLocators).toHaveLength(usersPageMock.length);
			});

			test('should display the toolbar', async () => {
				await expect.element(po.ghUsersToolbarLocator).toBeVisible();
			});

			test('should enable the "flip users to front" button', async () => {
				await expect(po.flipUsersToFrontButtonLocator).toBeEnabled();
			});

			test('should call GhUserService.updateCardFaces(true) when the "flip users to front" button is clicked', async () => {
				vi.spyOn(ghUserService, 'updateCardFaces').mockImplementation(() => {});
				await po.flipUsersToFrontButtonLocator.click();

				expect(ghUserService.updateCardFaces).toHaveBeenCalledWith(true);
			});

			test('should disable the previous page button when on the first page', async () => {
				await expect.element(po.previousPageButtonLocator).toBeDisabled();
			});

			test('should display the correct list of user cards when the next page button is clicked', async () => {
				await po.nextPageButtonLocator.click();

				expect(componentInstance.pseudoPageIndex()).toBe(1);
			});

			test('should display the correct list of user cards when the previous page button is clicked', async () => {
				await po.nextPageButtonLocator.click();
				await po.previousPageButtonLocator.click();

				expect(componentInstance.pseudoPageIndex()).toBe(0);
			});
		});
	});
});
