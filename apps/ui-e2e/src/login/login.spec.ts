import { BrowserContext, expect } from '@playwright/test';
import { test } from './login.fixture';

const EMAIL = 'user@example.com';
const PASSWORD = 'topsecret';

const addTokenCookies = async (context: BrowserContext) => {
	await context.addCookies([
		{
			name: 'access-token',
			value: 'FunnyString',
			domain: 'localhost',
			path: '/',
		},
		{
			name: 'refresh-token',
			value: 'AnotherFunnyString',
			domain: 'localhost',
			path: '/',
		},
	]);
}

test.beforeEach(async ({ loginPage }, testInfo) => {
	console.log('Running', `${testInfo.title}`);
});

test('login with wrong user and password should display an error message', async ({ loginPage }) => {
	await loginPage.page.route('*/**/api/auth/login', async (route) => {
		await route.fulfill({ status: 401 });
	});
	await loginPage.fill(EMAIL, PASSWORD);
	await loginPage.login();

	await expect(loginPage.error).toBeVisible();
});

test('login with correct user and password should not display an error message', async ({ loginPage, context }) => {
	await loginPage.page.route('*/**/api/auth/login', async (route) => {
		await addTokenCookies(context);
		await route.fulfill({ status: 200 });
	});
	await loginPage.fill(EMAIL, PASSWORD);
	await loginPage.login();

	await expect(loginPage.error).not.toBeVisible();
});
