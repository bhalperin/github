import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { describe, expect, test } from 'vitest';
import { authGuard } from './auth.guard';

/// TODO: Add tests for authGuard functionality

describe('authGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => authGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	test('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
