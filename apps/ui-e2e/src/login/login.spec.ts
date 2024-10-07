import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { addTokenCookies, EMAIL, PASSWORD } from '../utils';

test('login with wrong user and password should display an error message', async ({ page, loginPage }) => {
	await page.route(/\/auth\/login$/, async (route) => {
		await route.fulfill({ status: 401 });
	});
	await loginPage.goto();
	await loginPage.fill(EMAIL, PASSWORD);
	await loginPage.login();

	await expect(loginPage.error).toBeVisible();
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
