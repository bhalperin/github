import { TestBed } from '@angular/core/testing';
import { describe, expect, test } from 'vitest';
import { GhService } from './gh.service';

/// TODO: Add tests for GhService methods

describe('GhService', () => {
	let service: GhService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GhService);
	});

	test('should be created', () => {
		expect(service).toBeTruthy();
	});
});
