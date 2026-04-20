import { TestBed } from '@angular/core/testing';
import { describe, expect, test } from 'vitest';
import { AuthService } from './auth.service';

/// TODO: Add tests for AuthService methods

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AuthService);
	});

	test('should be created', () => {
		expect(service).toBeTruthy();
	});
});
