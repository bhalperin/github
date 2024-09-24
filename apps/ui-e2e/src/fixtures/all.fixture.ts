import { test as base } from '@playwright/test';
import { HomePage, LoginPage, GhUsersPage } from '../poms';

type Fixtures = {
	homePage: HomePage;
	loginPage: LoginPage;
	ghUsersPage: GhUsersPage;
};

export const test = base.extend<Fixtures>({
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);

		await homePage.goto();
		await use(homePage);
	},
	loginPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);

		await loginPage.goto();
		await use(loginPage);
	},
	ghUsersPage: async ({ page, context }, use) => {
		const ghUsersPage = new GhUsersPage(page);

		await ghUsersPage.goto();
		await use(ghUsersPage);
	},
});

test.beforeEach(async ({}, testInfo) => {
	console.log('Running', `${testInfo.title}`);
});
