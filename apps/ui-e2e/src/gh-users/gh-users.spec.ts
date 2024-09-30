import { GhUser } from '@gh/shared';
import { expect, Locator, Page } from '@playwright/test';
import { test } from '../fixtures';
import { LoginPage } from '../poms/login.page';
import { addTokenCookies, EMAIL, ghbUsersMock, ghUserMock, PASSWORD } from '../utils';

const loginSuccessfully = async (page: Page, loginPage: LoginPage) => {
	await loginPage.goto();
	await loginPage.fill(EMAIL, PASSWORD);
	await loginPage.login();
	await page.waitForURL(/users/);
};

test.describe('navigating to users page as an unauthenticated user', async () => {
	test('should redirect to login page', async ({ loginPage, ghUsersPage }) => {
		await ghUsersPage.goto();
		await expect(loginPage.email).toBeVisible;
	});
});

test.describe('navigating to users page as an authenticated user', async () => {
	test.beforeEach(async ({ page, context }) => {
		await page.route(/\/auth\/login/, async (route) => {
			await addTokenCookies(context);
			await route.fulfill({ status: 200 });
		});
	});

	test.describe('when there are no github users', () => {
		test.beforeEach(async ({ page, loginPage }) => {
			await page.route(/\/github\/users\?/, async (route) => {
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
			await page.route(/\/github\/users\?/, async (route) => {
				const json = ghbUsersMock;

				await route.fulfill({ json, status: 200 });
			});
			await page.route(/\/github\/users\/[^\/]+$/, async (route) => {
				const json = ghUserMock;

				await route.fulfill({ json, status: 200 });
			});
			await loginSuccessfully(page, loginPage);
		});

		test.beforeEach(async ({ page, ghUsersPage }) => {
			userList = await (await page.waitForResponse(/\github\/users\?/)).json() as GhUser[];
			firstUserCard = await ghUsersPage.userCards.first();
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
			test.beforeEach(async ({ page }) => {
				await firstUserCard.getByTestId('flipToBack').click()});

			test('user card should display the correct user name', async ({ ghUserPage }) => {
				await expect((await ghUserPage.userFullName.textContent()).trim()).toBe(ghUserMock.name);
			});

			test('user public repos should display the correct amount', async ({ ghUserPage }) => {
				await expect(parseInt((await ghUserPage.publicRepos.textContent()).trim())).toBe(ghUserMock.public_repos);
			});
		});
	});
});
