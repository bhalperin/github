import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { addTokenCookies, EMAIL, PASSWORD } from '../utils';


test.describe('when database connection fails', () => {
	test.beforeEach(async ({ page }) => {
		await page.route(/\/auth\/connected$/, async (route) => {
			await route.fulfill({ status: 200, body: 'false' });
		});
	});

	test('should display an error message', async ({ loginPage }) => {
		await loginPage.goto();
		await loginPage.fill(EMAIL, PASSWORD);
		await loginPage.login();

		await expect(loginPage.databaseConnectionError).toBeVisible();
	});
});

test.describe('when database connection succeeds', () => {
	test.beforeEach(async ({ page }) => {
		await page.route(/\/auth\/connected$/, async (route) => {
			await route.fulfill({ status: 200, body: 'true' });
		});
	});

	test('login with wrong user and password should display an error message', async ({ page, loginPage }) => {
		await page.route(/\/auth\/login$/, async (route) => {
			await route.fulfill({ status: 401 });
		});
		await loginPage.goto();
		await loginPage.fill(EMAIL, PASSWORD);
		await loginPage.login();

		await expect(loginPage.inavlidCredentialsError).toBeVisible();
	});

	test('login with correct user and password should navigate to users page', async ({ page, loginPage, context }) => {
		await page.route(/\/auth\/login$/, async (route) => {
			await addTokenCookies(context);
			await route.fulfill({ status: 200 });
		});
		await page.route(/\/github\/users\?/, async (route) => {
			await route.fulfill({ json: [], status: 200 });
		});
		await loginPage.goto();
		await loginPage.fill(EMAIL, PASSWORD);
		await loginPage.login();
		await page.waitForResponse(/\/github\/users\?/);

		await expect(page.url()).toMatch(/users$/);
	});
});
