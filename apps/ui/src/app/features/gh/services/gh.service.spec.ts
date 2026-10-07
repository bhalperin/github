import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, test } from 'vitest';

import { GhFullUserMock, GhRepoContributorMock, GhRepoLanguagesMock, GhUser, GhUserMock, GhUserRepo, GhUserRepoMock } from '@gh/shared/models';

import { errorInterceptor } from 'core/interceptors/error/error.interceptor';
import { BASE_GH_API_URL } from 'core/utils/api';

import { GhService } from './gh.service';

describe('GhService', () => {
	const userLogin = 'john_doe';
	const errorStatus = 500;
	const errorStatusText = 'Server error';
	const flushErrorOptions = { status: errorStatus, statusText: errorStatusText };
	let service: GhService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [GhService, provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting()],
		});
		service = TestBed.inject(GhService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	describe('Users', () => {
		describe('User list', () => {
			const url = `${BASE_GH_API_URL}/users?since=0`;
			const usersMock = [new GhUserMock().withId(1).data, new GhUserMock().withId(2).data] as GhUser[];

			test('getUsers should return the correct list of users', async () => {
				const usersResponse = firstValueFrom(service.getUsers());
				const req = httpTestingController.expectOne(url);

				expect(req.request.method).toEqual('GET');
				req.flush(usersMock);
				expect(await usersResponse).toEqual(usersMock);
			});

			test('getUsers should handle errors correctly', async () => {
				const errorResponse = firstValueFrom(service.getUsers());
				const req = httpTestingController.expectOne(url);

				req.flush('Failed!', flushErrorOptions);
				await expect(errorResponse).rejects.toThrow(`Http failure response for ${url}: ${errorStatus} ${errorStatusText}`);
			});
		});

		describe('Single user', () => {
			const url = `${BASE_GH_API_URL}/users/${userLogin}`;

			test('getUser should return the correct user', async () => {
				const userMock = new GhFullUserMock().withLogin(userLogin).data;
				const userResponse = firstValueFrom(service.getUser(userLogin));
				const req = httpTestingController.expectOne(url);

				expect(req.request.method).toEqual('GET');
				req.flush(userMock);
				expect(await userResponse).toEqual(userMock);
			});
		});
	});

	describe('User Repositories', () => {
		const url = `${BASE_GH_API_URL}/users/${userLogin}/repos?per_page=2`;
		const singleRepoMock = new GhUserRepoMock().withId(1).withName('repo1').data;

		describe('Repository list', () => {
			const reposPageOneMock = [singleRepoMock, new GhUserRepoMock().withId(2).withName('repo2').withName('my posh dashboard').data];
			const reposPageTwoMock = [
				new GhUserRepoMock().withId(3).withName('repo3').withName('mfe starter kit').data,
				new GhUserRepoMock().withId(4).withName('repo4').withName('nightly backup').data,
			];
			const reposPageThreeMock = [new GhUserRepoMock().withId(5).withName('repo5').withName('cron jobs').data];
			const reposPageFourMock = [] as GhUserRepo[];
			const allReposMock = [...reposPageOneMock, ...reposPageTwoMock, ...reposPageThreeMock, ...reposPageFourMock];

			test('calling getUserRepos with page = 1 should return the correct page of user repositories', async () => {
				const reposResponse = firstValueFrom(service.getUserRepos(userLogin, 1, 2));
				const req = httpTestingController.expectOne(`${url}&page=1`);

				expect(req.request.method).toEqual('GET');
				req.flush(reposPageOneMock);
				expect(await reposResponse).toEqual(reposPageOneMock);
			});

			test('getUserRepos should handle errors correctly', async () => {
				const errorResponse = firstValueFrom(service.getUserRepos(userLogin, 1, 2));
				const req = httpTestingController.expectOne(`${url}&page=1`);

				req.flush('Failed!', flushErrorOptions);
				await expect(errorResponse).rejects.toThrow(`Failed to fetch user repositories for ${userLogin}`);
			});

			test('getAllUserRepos should return the full list of user repositories', async () => {
				const allReposResponse = firstValueFrom(service.getAllUserRepos(userLogin, 2));

				const pageOneReq = httpTestingController.expectOne(`${url}&page=1`);
				pageOneReq.flush(reposPageOneMock);

				const pageTwoReq = httpTestingController.expectOne(`${url}&page=2`);
				pageTwoReq.flush(reposPageTwoMock);

				const pageThreeReq = httpTestingController.expectOne(`${url}&page=3`);
				pageThreeReq.flush(reposPageThreeMock);

				const pageFourReq = httpTestingController.expectOne(`${url}&page=4`);
				pageFourReq.flush(reposPageFourMock);

				expect(pageOneReq.request.method).toEqual('GET');
				expect(pageTwoReq.request.method).toEqual('GET');
				expect(pageThreeReq.request.method).toEqual('GET');
				expect(pageFourReq.request.method).toEqual('GET');

				expect(await allReposResponse).toEqual(allReposMock);
			});

			test('getAllUserRepos should handle errors correctly', async () => {
				const errorResponse = firstValueFrom(service.getAllUserRepos(userLogin, 2));
				const req = httpTestingController.expectOne(`${url}&page=1`);

				req.flush('Failed!', flushErrorOptions);
				await expect(errorResponse).rejects.toThrow(`Failed to fetch user repositories for ${userLogin}`);
			});
		});

		describe('Single repository', () => {
			const url = `${BASE_GH_API_URL}/repos/${userLogin}/${singleRepoMock.name}`;

			test('getRepo should return the correct repository', async () => {
				const repoResponse = firstValueFrom(service.getRepo(userLogin, 'repo1'));
				const req = httpTestingController.expectOne(url);

				req.flush(singleRepoMock);
				expect(await repoResponse).toEqual(singleRepoMock);
			});

			test('getRepo should handle errors correctly', async () => {
				const errorResponse = firstValueFrom(service.getRepo(userLogin, singleRepoMock.name));
				const req = httpTestingController.expectOne(url);

				req.flush('Failed!', flushErrorOptions);
				await expect(errorResponse).rejects.toThrow(`Failed to fetch user repository ${singleRepoMock.name} for ${userLogin}`);
			});
		});

		describe('Repository Contributors', () => {
			const url = `${BASE_GH_API_URL}/repos/${userLogin}/${singleRepoMock.name}/contributors`;
			const contributorsMock = [new GhRepoContributorMock().withId(1).withLogin('contributor1').data, new GhRepoContributorMock().withId(2).withLogin('contributor2').data];

			test('getRepoContributors should return the correct list of contributors', async () => {
				const contributorsResponse = firstValueFrom(service.getRepoContributors(userLogin, singleRepoMock.name));
				const req = httpTestingController.expectOne(url);

				req.flush(contributorsMock);
				expect(await contributorsResponse).toEqual(contributorsMock);
			});

			test('getRepoContributors should handle errors correctly', async () => {
				const errorResponse = firstValueFrom(service.getRepoContributors(userLogin, singleRepoMock.name));
				const req = httpTestingController.expectOne(url);

				req.flush('Failed!', flushErrorOptions);
				await expect(errorResponse).rejects.toThrow(`Failed to fetch contributors for user repository ${singleRepoMock.name} of ${userLogin}`);
			});
		});

		describe('Repository Languages', () => {
			const url = `${BASE_GH_API_URL}/repos/${userLogin}/${singleRepoMock.name}/languages`;
			const languagesMock = new GhRepoLanguagesMock().withLanguage('JavaScript', 1000).withLanguage('TypeScript', 500).data;

			test('getRepoLanguages should return the correct languages', async () => {
				const languagesResponse = firstValueFrom(service.getRepoLanguages(userLogin, singleRepoMock.name));
				const req = httpTestingController.expectOne(url);

				req.flush(languagesMock);
				expect(await languagesResponse).toEqual(languagesMock);
			});

			test('getRepoLanguages should handle errors correctly', async () => {
				const errorResponse = firstValueFrom(service.getRepoLanguages(userLogin, singleRepoMock.name));
				const req = httpTestingController.expectOne(url);

				req.flush('Failed!', flushErrorOptions);
				await expect(errorResponse).rejects.toThrow(`Failed to fetch languages for user repository ${singleRepoMock.name} of ${userLogin}`);
			});
		});
	});
});
