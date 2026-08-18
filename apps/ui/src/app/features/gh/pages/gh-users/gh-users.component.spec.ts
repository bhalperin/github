import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, test, vi } from 'vitest';

import { GhUser, GhUserMock } from '@gh/shared/models';

import { BASE_GH_API_URL } from 'core/utils/api';
import { testSetup } from 'core/utils/test/setup';

import { GhUserService } from '../../services/gh-user.service';
import { GhUsersComponent } from './gh-users.component';
import { GhUsersPageObject } from './gh-users.page-object';

describe('GhUsersComponent', () => {
	const baseUsersApiUrl = `${BASE_GH_API_URL}/users`;
	const usersPageOneMock = [new GhUserMock().withId(1).data, new GhUserMock().withId(2).data] as GhUser[];
	const usersPageTwoMock = [new GhUserMock().withId(3).data, new GhUserMock().withId(4).data, new GhUserMock().withId(5).data] as GhUser[];
	const composeApiUrl = (sinceId: number) => `${baseUsersApiUrl}?since=${sinceId}`;
	let httpTestingController: HttpTestingController;
	let ghUserService: GhUserService;
	let po: GhUsersPageObject;

	async function fireHttpRequest(responseMock: GhUser[], sinceId = 0) {
		TestBed.tick();

		const requests = httpTestingController.match((req) => req.url.includes(composeApiUrl(sinceId)));

		expect(requests.length).toBeGreaterThanOrEqual(1);
		requests.forEach((req) => req.flush(responseMock));

		// This allows the asynchronous callback from `req.flush()` to resolve
		// and push its new value into Angular's Signal Graph.
		await new Promise((resolve) => setTimeout(resolve));
	}

	async function fireHttpRequestAndError() {
		TestBed.tick();

		const requests = httpTestingController.match((req) => req.url.includes(composeApiUrl(0)));

		expect(requests.length).toBeGreaterThanOrEqual(1);
		requests.forEach((req) => req.flush('Failed!', { status: 500, statusText: 'Server error' }));

		// This allows the asynchronous callback from `req.flush()` to resolve
		// and push its new value into Angular's Signal Graph.
		await new Promise((resolve) => setTimeout(resolve));
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhUsersComponent],
			providers: [provideHttpClient(), provideHttpClientTesting(), GhUserService],
		}).compileComponents();
		TestBed.createComponent(GhUsersComponent);
		testSetup(GhUsersComponent);

		httpTestingController = TestBed.inject(HttpTestingController);
		ghUserService = TestBed.inject(GhUserService);
		po = new GhUsersPageObject();
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	describe('User cards', () => {
		test('should display no user cards when users are empty', async () => {
			await fireHttpRequest([]);

			await expect(po.ghUserLocators).toHaveLength(0);
		});

		test('should display the correct list of user cards when users are non-empty', async () => {
			await fireHttpRequest(usersPageOneMock);

			await expect.element(po.ghUserLocators).toHaveLength(usersPageOneMock.length);
		});

		test('should display an error message when the users request fails', async () => {
			await fireHttpRequestAndError();

			await expect.element(po.ghUsersToolbarLocator).not.toBeInTheDocument();
			await expect.element(po.ghUsersErrorLocator).toBeVisible();
		});
	});

	describe('Toolbar', () => {
		test('should display the toolbar when the users request succeeds', async () => {
			await fireHttpRequest(usersPageOneMock);

			await expect.element(po.ghUsersToolbarLocator).toBeVisible();
		});

		test('should not display the toolbar when the users request fails', async () => {
			await fireHttpRequestAndError();

			await expect.element(po.ghUsersToolbarLocator).not.toBeInTheDocument();
		});

		test('should disable the "flip users to front" button when there are no users', async () => {
			await fireHttpRequest([]);

			await expect.element(po.flipUsersToFrontButtonLocator).toBeDisabled();
		});

		test('should enable the "flip users to front" button when there are users', async () => {
			await fireHttpRequest(usersPageOneMock);

			await expect(po.flipUsersToFrontButtonLocator).toBeEnabled();
		});

		test('should call GhUserService.updateCardFaces(true) when the "flip users to front" button is clicked', async () => {
			await fireHttpRequest(usersPageOneMock);
			vi.spyOn(ghUserService, 'updateCardFaces').mockImplementation(() => {});
			await po.flipUsersToFrontButtonLocator.click();

			expect(ghUserService.updateCardFaces).toHaveBeenCalledWith(true);
		});

		test('should disable the previous page button when on the first page', async () => {
			await fireHttpRequest(usersPageOneMock);

			await expect.element(po.previousPageButtonLocator).toBeDisabled();
		});

		test('should display the correct list of user cards when the next page button is clicked', async () => {
			await fireHttpRequest(usersPageOneMock);
			await po.nextPageButtonLocator.click();
			httpTestingController.expectOne((req) => req.url.includes(composeApiUrl(2))).flush(usersPageTwoMock);

			await expect.element(po.ghUserLocators).toHaveLength(usersPageTwoMock.length);
			await expect.element(po.ghUserLocators.first()).toHaveAttribute('data-user-id', usersPageTwoMock[0].id.toString());
			await expect.element(po.ghUserLocators.last()).toHaveAttribute('data-user-id', usersPageTwoMock[usersPageTwoMock.length - 1].id.toString());
		});

		test('should display the correct list of user cards when the previous page button is clicked', async () => {
			await fireHttpRequest(usersPageOneMock);
			await po.nextPageButtonLocator.click();
			httpTestingController.expectOne((req) => req.url.includes(composeApiUrl(2))).flush(usersPageTwoMock);
			await po.previousPageButtonLocator.click();
			httpTestingController.expectOne((req) => req.url.includes(composeApiUrl(0))).flush(usersPageOneMock);

			await expect.element(po.ghUserLocators).toHaveLength(usersPageOneMock.length);
			await expect.element(po.ghUserLocators.first()).toHaveAttribute('data-user-id', usersPageOneMock[0].id.toString());
			await expect.element(po.ghUserLocators.last()).toHaveAttribute('data-user-id', usersPageOneMock[usersPageOneMock.length - 1].id.toString());
		});
	});
});
