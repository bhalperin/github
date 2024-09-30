import { test as base } from '@playwright/test';
import { GhUserPage, GhUsersPage, HomePage, LoginPage } from '../poms';

type Fixtures = {
	homePage: HomePage;
	loginPage: LoginPage;
	ghUsersPage: GhUsersPage;
	ghUserPage: GhUserPage
};

export const test = base.extend<Fixtures>({
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);

		await homePage.goto();
		await use(homePage);
	},
	loginPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);

		await use(loginPage);
	},
	ghUsersPage: async ({ page }, use) => {
		const ghUsersPage = new GhUsersPage(page);

		await use(ghUsersPage);
	},
	ghUserPage: async ({ page }, use) => {
		const ghUserPage = new GhUserPage(page);

		await use(ghUserPage);
	},
});

test.beforeEach((args, testInfo) => {
	console.log('Running', `${testInfo.title}`);
});
