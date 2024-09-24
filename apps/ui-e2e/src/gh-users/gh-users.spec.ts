import { BrowserContext, expect } from '@playwright/test';
import { test } from '../fixtures';

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
};

test.describe('navigating to users page unauthenticated', async () => {
	test('should redirect to login page', async ({ ghUsersPage }) => {
		await expect(ghUsersPage.page.url()).toMatch(/login/);
	});
});

test.describe('navigating to users page authenticated', async () => {
	test.beforeEach(async ({ loginPage, context }) => {
		await loginPage.page.route('*/**/api/auth/login', async (route) => {
			await addTokenCookies(context);
			await route.fulfill({ status: 200 });
		});
		await loginPage.fill(EMAIL, PASSWORD);
		await loginPage.login();
		await addTokenCookies(context);
	});

	test('should stay in users page', async ({ ghUsersPage, context }) => {
		await expect(ghUsersPage.page.url()).toMatch(/users/);
	});
});
