import { expect } from '@playwright/test';
import { test } from '../fixtures';

test('Navigation bar', async ({ homePage }) => {
	const navLinkTexts = await homePage.page.locator('nav a').allInnerTexts();

	expect(navLinkTexts.length).toBe(3);
	expect(navLinkTexts[0].toLocaleLowerCase()).toContain('home');
});
