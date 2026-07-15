// import '@angular/compiler';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppRouter } from 'fw-extensions/app-router';
import { firstValueFrom, of } from 'rxjs';
import { AuthService } from 'services/auth.service';
import { PUBLIC_API, REFRESH_API } from 'utils/api';
import { describe, expect, test, vi } from 'vitest';
import { authInterceptor } from './auth.interceptor';

/// Tests for authInterceptor behavior, including token attachment and refresh retry.
describe('authInterceptor', () => {
	let httpTestingController: HttpTestingController;
	let httpClient: HttpClient;
	let authServiceMock: {
		readonly accessToken: string;
		readonly refreshToken: string;
		readonly refresh: ReturnType<typeof vi.fn>;
		readonly saveCredentials: ReturnType<typeof vi.fn>;
	};
	let appRouterMock: {
		readonly navigateToTokenExpired: ReturnType<typeof vi.fn>;
	};
	const expectOneTestRequest = () => httpTestingController.expectOne('/test');

	beforeEach(() => {
		let currentAccessToken = 'old-token';
		let currentRefreshToken = 'refresh-token';

		authServiceMock = {
			get accessToken() {
				return currentAccessToken;
			},
			get refreshToken() {
				return currentRefreshToken;
			},
			refresh: vi.fn(() => {
				currentAccessToken = 'new-token';
				currentRefreshToken = 'new-refresh';

				return of({ accessToken: currentAccessToken, refreshToken: currentRefreshToken });
			}),
			saveCredentials: vi.fn(),
		};

		appRouterMock = {
			navigateToTokenExpired: vi.fn(async () => Promise.resolve()),
		};

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([authInterceptor])),
				provideHttpClientTesting(),
				{
					provide: AuthService,
					useValue: authServiceMock,
				},
				{
					provide: AppRouter,
					useValue: appRouterMock,
				},
			],
		});

		httpTestingController = TestBed.inject(HttpTestingController);
		httpClient = TestBed.inject(HttpClient);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	test('should return the correct response if successful', async () => {
		const responsePromise = firstValueFrom(httpClient.get<boolean>('/test'));
		const req = expectOneTestRequest();

		req.flush(true);

		await expect(responsePromise).resolves.toEqual(true);
	});

	test('should throw an error if unsuccessful', async () => {
		const responsePromise = firstValueFrom(httpClient.get<boolean>('/test'));
		const req = expectOneTestRequest();
		const errorStatus = 500;
		const errorStatusText = 'Server error';

		req.error(new ProgressEvent('Network error'), { status: errorStatus, statusText: errorStatusText });

		await expect(responsePromise).rejects.toThrow(`Http failure response for /test: ${errorStatus} ${errorStatusText}`);
	});

	test('should skip authorization for public requests', async () => {
		const responsePromise = firstValueFrom(httpClient.get<boolean>('/test', { context: PUBLIC_API }));
		const req = expectOneTestRequest();

		req.flush(true);

		await responsePromise;

		expect(req.request.headers.has('Authorization')).toBe(false);
	});

	test('should attach authorization header to non-public requests', async () => {
		const responsePromise = firstValueFrom(httpClient.get<boolean>('/test'));
		const req = expectOneTestRequest();

		req.flush(true);

		await responsePromise;

		expect(req.request.headers.get('Authorization')).toBe('Bearer old-token');
	});

	test('should refresh token and retry request on 401 error', async () => {
		const responsePromise = firstValueFrom(httpClient.get<boolean>('/test'));
		const req = expectOneTestRequest();

		expect(req.request.headers.get('Authorization')).toBe('Bearer old-token');

		// simulate 401 response for initial request
		req.flush(null, { status: 401, statusText: 'Unauthorized' });

		expect(authServiceMock.refresh).toHaveBeenCalledWith('refresh-token');

		// retry request should be made with new token
		const retryReq = expectOneTestRequest();

		expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token');

		retryReq.flush(true);
		await expect(responsePromise).resolves.toBe(true);

		expect(authServiceMock.saveCredentials).toHaveBeenCalled();
	});

	test('should navigate to token-expired when refresh request fails with 401', async () => {
		const responsePromise = firstValueFrom(httpClient.get('/test', { context: REFRESH_API }));
		const req = expectOneTestRequest();

		expect(req.request.headers.get('Authorization')).toBe('Bearer old-token');

		// simulate 401 response for refresh request
		req.flush(null, { status: 401, statusText: 'Unauthorized' });

		await expect(responsePromise).rejects.toThrow('Http failure response for /test: 401 Unauthorized');

		expect(appRouterMock.navigateToTokenExpired).toHaveBeenCalled();
		expect(authServiceMock.refresh).not.toHaveBeenCalled();
	});
});
