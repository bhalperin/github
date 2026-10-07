import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { describe, expect, Mock, test, vi } from 'vitest';

import { AppRouter } from 'core/fw-extensions/app-router';
import { testSetup } from 'core/utils/test/setup';

import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { LoginPageObject } from './login.page-object';

describe('LoginComponent', () => {
	const EMAIL = 'test@example.com';
	const PASSWORD = 'password123';
	const setup = () => {
		const { fixture, component } = testSetup(LoginComponent);

		return { fixture, component, po: new LoginPageObject() };
	};
	const fillForm = async (email = EMAIL, password = PASSWORD) => {
		await po.emailLocator.fill(email);
		await po.passwordLocator.fill(password);
	};
	const fillFormAndSubmit = async (email = EMAIL, password = PASSWORD) => {
		await fillForm(email, password);
		await po.submitButtonLocator.click();
	};
	let appRouter: AppRouter;
	let authServiceMock: {
		isConnected: Mock<() => Observable<boolean>>;
		login: Mock<() => Observable<Object | null>>;
		loginGoogle: Mock<() => void>;
		logout: Mock<() => void>;
		serverError: WritableSignal<boolean>;
		authenticated: boolean;
	};
	let po: LoginPageObject;

	beforeEach(async () => {
		authServiceMock = {
			isConnected: vi.fn().mockReturnValue(of(true)),
			login: vi.fn().mockReturnValue(of({ accessToken: 'test-access-token', refreshToken: 'test-refresh-token' })),
			loginGoogle: vi.fn().mockImplementation(() => {}),
			logout: vi.fn(),
			serverError: signal(false),
			authenticated: false,
		};
		await TestBed.configureTestingModule({
			imports: [LoginComponent],
			providers: [provideHttpClientTesting, AppRouter, { provide: AuthService, useValue: authServiceMock }],
		}).compileComponents();
		appRouter = TestBed.inject(AppRouter);
		({ po } = setup());
	});

	describe('Connection status', () => {
		test('should not display connection error message when submitting the form and connection is available', async () => {
			authServiceMock.isConnected.mockReturnValue(of(true));
			await fillFormAndSubmit();

			await expect.element(po.connectionErrorLocator).not.toBeInTheDocument();
		});

		test('should display connection error message when submitting the form and connection is not available', async () => {
			authServiceMock.isConnected.mockReturnValue(of(false));
			await fillFormAndSubmit();

			await expect.element(po.connectionErrorLocator).toBeVisible();
		});
	});

	describe('Form validation', () => {
		test('submit button should not be clickable if email or password is empty', async () => {
			await expect.element(po.submitButtonLocator).toBeDisabled();
		});

		test('submit button should be clickable if email and password are provided', async () => {
			await fillForm();

			await expect.element(po.submitButtonLocator).toBeEnabled();
		});
	});

	describe('Login process', () => {
		test('should call login method of AuthService with correct credentials when form is submitted', async () => {
			await fillFormAndSubmit();

			expect(authServiceMock.login).toHaveBeenCalledWith(EMAIL, PASSWORD);
		});

		test('should navigate to users page when login is successful', async () => {
			vi.spyOn(appRouter, 'navigateToUsers').mockImplementation(async () => Promise.resolve());
			authServiceMock.authenticated = true;
			await fillFormAndSubmit();

			expect(appRouter.navigateToUsers).toHaveBeenCalled();
		});

		test('should display invalid credentials message when login fails', async () => {
			authServiceMock.authenticated = false;
			await fillFormAndSubmit();

			await expect.element(po.invalidCredentialsErrorLocator).toBeVisible();
		});

		test('should display server error message when serverError signal is true', async () => {
			authServiceMock.serverError.set(true);
			await fillFormAndSubmit();

			await expect.element(po.serverErrorLocator).toBeVisible();
		});

		test('should display spinner when form is submitted and hide it after login process', async () => {
			const loginStream$ = new Subject<Object | null>();

			authServiceMock.login = vi.fn().mockReturnValue(loginStream$);
			await expect.element(po.spinnerLocator).not.toBeInTheDocument();
			await fillFormAndSubmit();
			await expect.element(po.spinnerLocator).toBeVisible();
			loginStream$.next({ accessToken: 'test-access-token', refreshToken: 'test-refresh-token' });
			loginStream$.complete();
			await expect.element(po.spinnerLocator).not.toBeInTheDocument();
		});
	});

	describe('Google login', () => {
		test('should call loginGoogle method of AuthService when Google login button is clicked and connection is available', async () => {
			const loginGoogleSpy = vi.spyOn(authServiceMock, 'loginGoogle'); // .mockImplementation(() => {});

			authServiceMock.isConnected.mockReturnValue(of(true));
			await po.loginGoogleButtonLocator.click();

			expect(loginGoogleSpy).toHaveBeenCalled();
		});

		test('should not call loginGoogle method of AuthService when Google login button is clicked and connection is not available', async () => {
			const loginGoogleSpy = vi.spyOn(authServiceMock, 'loginGoogle'); // .mockImplementation(() => {});

			authServiceMock.isConnected.mockReturnValue(of(false));
			await po.loginGoogleButtonLocator.click();

			expect(loginGoogleSpy).not.toHaveBeenCalled();
		});
	});
});
