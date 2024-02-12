import { expect, test } from '@playwright/test';

test('Navigation bar', async ({ page }) => {
	await page.goto('/');

	const navLinkTexts = await page.locator('nav a').allInnerTexts();

	// Expect nav elements to of the right length and to contain the right text
	expect(navLinkTexts.length).toBe(3);
	expect(navLinkTexts[0].toLocaleLowerCase()).toContain('home');
});
