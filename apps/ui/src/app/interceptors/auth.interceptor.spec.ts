import { HttpInterceptorFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { describe, expect, test } from 'vitest';
import { authInterceptor } from './auth.interceptor';

/// TODO: Add tests for authInterceptor functionality

describe('authInterceptor', () => {
	const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => authInterceptor(req, next));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	test('should be created', () => {
		expect(interceptor).toBeTruthy();
	});
});
