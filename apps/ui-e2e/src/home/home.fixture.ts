import { test as base } from '@playwright/test';
import { HomePage } from './home.page';

type HomeFixtures = {
	homePage: HomePage
}

export const test = base.extend<HomeFixtures>({
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);

		await homePage.goto();
		await use(homePage);
	}
});
