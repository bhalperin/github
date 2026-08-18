import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom } from 'rxjs';
import { describe, expect, Mock, test, vi } from 'vitest';

import { errorInterceptor } from 'core/interceptors/error/error.interceptor';

import { AuthService } from './auth.service';

describe('AuthService', () => {
	const tokens = { accessToken: 'test-access-token', refreshToken: 'test-refresh-token' };
	const flushErrorOptions = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
	let authService: AuthService;
	let httpTestingController: HttpTestingController;
	let cookieServiceMock: {
		get: Mock<() => string>;
		set: Mock;
		delete: Mock<() => void>;
	};

	beforeEach(() => {
		cookieServiceMock = {
			get: vi.fn(),
			set: vi.fn(),
			delete: vi.fn(),
		};

		TestBed.configureTestingModule({
			providers: [
				AuthService,
				{
					provide: CookieService,
					useValue: cookieServiceMock,
				},
				provideHttpClient(withInterceptors([errorInterceptor])),
				provideHttpClientTesting(),
			],
		});
		authService = TestBed.inject(AuthService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	describe('Auth Service', () => {
		const loginSuccessfully = (): Promise<Object | null> => {
			const response = firstValueFrom(authService.login('email', 'password'));
			const req = httpTestingController.expectOne('/api/auth/login');

			cookieServiceMock.get.mockReturnValue('some_key');
			req.flush(tokens);

			return response;
		};

		test('User should be unauthenticated by default', () => {
			expect(authService.authenticated).toBe(false);
		});

		test('User should be authenticated when saving credentials', () => {
			authService.saveCredentials();
			expect(authService.authenticated).toBe(true);
		});

		test('Should clear credentials and set authenticated to false', () => {
			authService.saveCredentials();
			expect(authService.authenticated).toBe(true);
			authService.clearCredentials();
			expect(authService.authenticated).toBe(false);
		});

		test('Should return undefined for lastError when no error has occurred', () => {
			expect(authService.lastError).toBeUndefined();
		});

		test('Should return true for serverError when login generates a server error', async () => {
			const response = firstValueFrom(authService.login('email', 'password'));
			const req = httpTestingController.expectOne('/api/auth/login');

			req.flush(null, flushErrorOptions);
			expect(await response).toBeNull();
			expect(authService.authenticated).toBe(false);
			expect(authService.serverError()).toBe(true);
		});

		test('User should be authenticated after successful login', async () => {
			const response = await loginSuccessfully();

			expect(await response).toEqual(tokens);
			expect(authService.authenticated).toBe(true);
		});

		test('User should be unauthenticated after logging out', async () => {
			await loginSuccessfully();
			authService.logout();
			expect(authService.authenticated).toBe(false);
		});
	});
});
