import { TestBed } from '@angular/core/testing';
import { testSetup } from 'core/utils/test/setup';
import { describe, expect, test } from 'vitest';
import { Locator, page } from 'vitest/browser';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
	let emailLocator: Locator;
	let passwordLocator: Locator;
	let submitButtonLocator: Locator;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LoginComponent],
		}).compileComponents();

		testSetup(LoginComponent);
		emailLocator = page.getByTestId('email');
		passwordLocator = page.getByTestId('password');
		submitButtonLocator = page.getByTestId('submit');
	});

	test('submit button should not be clickable if email or password is empty', async () => {
		await expect.element(submitButtonLocator).toBeDisabled();
	});

	test('submit button should be clickable if email and password are provided', async () => {
		await emailLocator.fill('test@example.com');
		await passwordLocator.fill('password123');

		await expect.element(submitButtonLocator).toBeEnabled();
	});
});
