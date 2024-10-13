import { test as base } from '@playwright/test';
import { GhUserPage, GhUserRepoPage, GhUserReposPage, GhUsersPage, HomePage, LoginPage } from '../poms';

type Fixtures = {
	homePage: HomePage;
	loginPage: LoginPage;
	ghUsersPage: GhUsersPage;
	ghUserPage: GhUserPage;
	ghUserReposPage: GhUserReposPage;
	ghUserRepoPage: GhUserRepoPage;
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
	ghUserReposPage: async ({ page }, use) => {
		const ghUserReposPage = new GhUserReposPage(page);

		await use(ghUserReposPage);
	},
	ghUserRepoPage: async ({ page }, use) => {
		const ghUserRepoPage = new GhUserRepoPage(page);

		await use(ghUserRepoPage);
	},
});

test.beforeEach(() => {
	console.log('Running', `${test.info().title}`);
});
