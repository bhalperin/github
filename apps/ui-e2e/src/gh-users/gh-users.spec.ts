import { GhUser } from '@gh/shared/models';
import { expect, Locator, Page } from '@playwright/test';
import { test } from '../fixtures';
import { GhUserRepoPage, LoginPage } from '../poms';
import { addTokenCookies, EMAIL, ghRepoContributorsMock, ghRepoLanguagesMock, ghUserMock, ghUserReposMock, ghUsersMock, PASSWORD } from '../utils';

const loginSuccessfully = async (page: Page, loginPage: LoginPage) => {
	await loginPage.goto();
	await loginPage.fill(EMAIL, PASSWORD);
	await loginPage.login();
	await page.waitForURL(/users/);
};

const API_URL_PATTERN = {
	users: /\/github\/users\?/,
	fullUser: /\/github\/users\/[^/]+$/,
	userRepos: /\/github\/users\/[^/]+\/repos\?/,
	repo: /\/github\/repos\/[^/]+\/[^/]+$/,
	repoContributors: /\/github\/repos\/[^/]+\/[^/]+\/contributors$/,
	repoLanguages: /\/github\/repos\/[^/]+\/[^/]+\/languages$/,
};

test.describe('navigating to users page as an unauthenticated user', () => {
	test('should redirect to login page', async ({ loginPage, ghUsersPage }) => {
		await ghUsersPage.goto();
		await expect(loginPage.email).toBeVisible();
	});
});

test.describe('navigating to users page as an authenticated user', () => {
	test.beforeEach(async ({ page, context }) => {
		await page.route(/\/auth\/login/, async (route) => {
			await addTokenCookies(context);
			await route.fulfill({ status: 200 });
		});
	});

	test.describe('when there are no github users', () => {
		test.beforeEach(async ({ page, loginPage }) => {
			await page.route(API_URL_PATTERN.users, async (route) => {
				await route.fulfill({ json: [], status: 200 });
			});
			await loginSuccessfully(page, loginPage);
		});

		test('should display no cards', async ({ ghUsersPage }) => {
			await expect(await ghUsersPage.noUsersFound).toBeVisible();
			await expect(await ghUsersPage.userCards.count()).toBe(0);
		});
	});

	test.describe('when there are github users', () => {
		let userList: GhUser[];
		let firstUserCard: Locator;

		test.beforeEach(async ({ page, loginPage }) => {
			await page.route(API_URL_PATTERN.users, async (route) => {
				const json = ghUsersMock;

				await route.fulfill({ json, status: 200 });
			});
			await page.route(API_URL_PATTERN.fullUser, async (route) => {
				const json = ghUserMock;

				await route.fulfill({ json, status: 200 });
			});
			await loginSuccessfully(page, loginPage);
		});

		test.beforeEach(async ({ page, ghUsersPage }) => {
			userList = (await (await page.waitForResponse(API_URL_PATTERN.users)).json()) as GhUser[];
			firstUserCard = ghUsersPage.userCards.first();
		});

		test('should display the correct number of cards', async ({ ghUsersPage }) => {
			const usersCount = userList?.length;

			await expect((await ghUsersPage.usersInPage.textContent()).trim()).toBe(usersCount.toString());
			await expect(await ghUsersPage.userCards.count()).toBe(usersCount);
		});

		test('first card should display the correct login', async () => {
			const login = (await firstUserCard.getByTestId('userLogin').textContent()).trim();

			await expect(login).toBe(userList[0].login);
		});

		test.describe('flipping the first card', () => {
			test.beforeEach(async () => {
				await firstUserCard.getByTestId('flipToBack').click();
			});

			test('user card should display the correct user name', async ({ ghUserPage }) => {
				const userFullName = (await ghUserPage.userFullName.textContent()).trim();

				await expect(userFullName).toBe(ghUserMock.name);
			});

			test('user public repos should display the correct amount', async ({ ghUserPage }) => {
				const publicReposCount = parseInt((await ghUserPage.publicRepos.textContent()).trim());

				await expect(publicReposCount).toBe(ghUserMock.public_repos);
			});

			test.describe('clicking the repos count to pop up the repos dialog', () => {
				const getRepo = (async (page: Page, index: number) => {
					await page.route(API_URL_PATTERN.repo, async (route) => {
						const json = ghUserReposMock.at(index);

						await route.fulfill({ json, status: 200 });
					});
				});
				const getRepoContributors = (async (page: Page, empty = false) => {
					await page.route(API_URL_PATTERN.repoContributors, async (route) => {
						const json = empty ? [] : ghRepoContributorsMock;

						await route.fulfill({ json, status: 200 });
					});
				});
				const getRepoLanguages = (async (page: Page, empty = false) => {
					await page.route(API_URL_PATTERN.repoLanguages, async (route) => {
						const json = empty ? [] : ghRepoLanguagesMock;

						await route.fulfill({ json, status: 200 });
					});
				});
				const expandRepo = (async (ghUserRepoPage: GhUserRepoPage, index: number) => {
					await ghUserRepoPage.collapseTrigger.nth(index).click();
					await ghUserRepoPage.repoDetails.nth(index).waitFor({ state: 'attached'});
					await ghUserRepoPage.contributors.nth(index).waitFor({ state: 'attached'});
					await ghUserRepoPage.languages.nth(index).waitFor({ state: 'attached'});
				});

				test.beforeEach(async ({ page }) => {
					await page.route(API_URL_PATTERN.userRepos, async (route) => {
						const url = URL.parse(route.request().url());
						const repoPage = parseInt(url.searchParams.get('page'));
						const json = repoPage === 1 ? ghUserReposMock : [];

						await route.fulfill({ json, status: 200 });
					});
				});

				test.beforeEach(async ({ ghUserPage }) => {
					await ghUserPage.publicRepos.click();
				});

				test('should display user name', async ({ ghUserReposPage }) => {
					await expect(ghUserReposPage.userName).toHaveText(ghUserMock.name);
				});

				test('should show the correct number of repos', async ({ ghUserReposPage }) => {
					await expect(ghUserReposPage.repoListItems).toHaveCount(ghUserReposMock.length);
				});

				test('repo list item should show the repo name', async ({ ghUserRepoPage }) => {
					const repoName = ghUserRepoPage.repoName.first();

					await expect(repoName).toHaveText(ghUserReposMock.at(0).name);
				});

				test.describe('Expanding a repo that has a parent repo', () => {
					test.beforeEach(async ({ page, ghUserRepoPage }) => {
						await getRepo(page, 0);
						await getRepoContributors(page);
						await getRepoLanguages(page);
						await expandRepo(ghUserRepoPage, 0);
					});

					test('should display parent repo full name', async({ ghUserRepoPage }) => {
						const parentRepoName = ghUserRepoPage.parentRepoFullName.first();

						await expect(parentRepoName).toHaveText(ghUserReposMock.at(0).parent.full_name);
					});
				});

				test.describe('Expanding a repo that does not have a parent repo', () => {
					test.beforeEach(async ({ page, ghUserRepoPage }) => {
						await getRepo(page, 1);
						await getRepoContributors(page);
						await getRepoLanguages(page);
						await expandRepo(ghUserRepoPage, 1);
					});

					test('should not display parent repo full name', async({ ghUserRepoPage }) => {
						await expect(ghUserRepoPage.parentRepoFullName.nth(1)).toBeHidden();
					});
				});

				test.describe('Expanding a repo that has contributors', () => {
					test.beforeEach(async ({ page, ghUserRepoPage }) => {
						await getRepo(page, 0);
						await getRepoContributors(page);
						await getRepoLanguages(page);
						await expandRepo(ghUserRepoPage, 0);
					});

					test('should display list of contributor logins', async ({ ghUserRepoPage }) => {
						const contributors = ghUserRepoPage.contributors.first();

						await expect(contributors).toHaveText(ghRepoContributorsMock.map((contributor) => contributor.login).join(', '));
					});
				});

				test.describe('Expanding a repo that does not have contributors', () => {
					test.beforeEach(async ({ page, ghUserRepoPage }) => {
						await getRepo(page, 0);
						await getRepoContributors(page, true);
						await getRepoLanguages(page);
						await expandRepo(ghUserRepoPage, 0);
					});

					test('should not display list of contributor logins', async ({ ghUserRepoPage }) => {
						const contributors = ghUserRepoPage.contributors.first();

						await expect(contributors).toHaveText('');
					});
				});

				test.describe('Expanding a repo that has langauges', () => {
					test.beforeEach(async ({ page, ghUserRepoPage }) => {
						await getRepo(page, 0);
						await getRepoContributors(page);
						await getRepoLanguages(page);
						await expandRepo(ghUserRepoPage, 0);
					});

					test('should display list of languages and their percentages', async ({ ghUserRepoPage }) => {
						const languages = ghUserRepoPage.languages.first();
						const languageRows = languages.getByTestId('languageRow');
						const languageCount = await languageRows.count();
						const firstLanguage = languageRows.first();

						await expect(languageCount).toBe(3);
						await expect(firstLanguage).toHaveText('TypeScript (63.16%)');
					});
				});

				test.describe('Expanding a repo that does not have langauges', () => {
					test.beforeEach(async ({ page, ghUserRepoPage }) => {
						await getRepo(page, 0);
						await getRepoContributors(page);
						await getRepoLanguages(page, true);
						await expandRepo(ghUserRepoPage, 0);
					});

					test('should not display list of languages', async ({ ghUserRepoPage }) => {
						const languages = ghUserRepoPage.languages.first();
						const languageRows = languages.getByTestId('languageRow');

						await expect(await languageRows.count()).toBe(0);
						await expect ((await languages.textContent()).trim().toLowerCase()).toBe('no languages specified');
					});
				});
			});
		});
	});
});
