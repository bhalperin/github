import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, test } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
			providers: [provideHttpClientTesting, provideRouter([])],
		}).compileComponents();
	});

	test(`When app starts user should be unauthenticated`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;

		expect(app.authenticated).toBe(false);
	});
});
