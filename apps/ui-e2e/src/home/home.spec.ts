import { expect } from '@playwright/test';
import { test } from './home.fixture';

test.beforeEach(async ({ homePage }, testInfo) => {
	console.log('Running', `${testInfo.title}`);
});

test('Navigation bar', async ({ page }) => {
	const navLinkTexts = await page.locator('nav a').allInnerTexts();

	// Expect nav elements to of the right length and to contain the right text
	expect(navLinkTexts.length).toBe(3);
	expect(navLinkTexts[0].toLocaleLowerCase()).toContain('home');
});
