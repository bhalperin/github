import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testSetup } from 'utils/test/setup';
import { describe, expect, test, vi } from 'vitest';
import { LoaderDirective } from './loader.directive';

@Component({
	selector: 'gh-loader-test',
	imports: [LoaderDirective],
	template: `<div ghLoader [loading]="loading()"></div>`,
})
class LoaderTestComponent {
	loading = input<boolean | undefined>();
}

describe('LoaderDirective', () => {
	const setup = () => {
		const { fixture, component } = testSetup(LoaderTestComponent);

		return { fixture, component };
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LoaderTestComponent],
		}).compileComponents();
	});

	describe('should call "show()" or "hide()" depending on whether loading is true', () => {
		let fixture: ComponentFixture<LoaderTestComponent>;
		let directive: LoaderDirective;

		beforeEach(async () => {
			fixture = setup().fixture;
			await fixture.whenStable();
			directive = fixture.debugElement.query((de) => de.injector.get(LoaderDirective, null) !== null)?.injector.get(LoaderDirective);
		});

		test('should call "show()" when loading is true', async () => {
			vi.spyOn(directive!, 'show');
			fixture.componentRef.setInput('loading', true);
			fixture.detectChanges();

			expect(directive.overlayRef.hasAttached()).toBe(true);
			expect(directive.show).toHaveBeenCalledOnce();
		});

		test('should call "hide()" when loading is false', async () => {
			vi.spyOn(directive!, 'hide');
			fixture.componentRef.setInput('loading', false);
			fixture.detectChanges();

			expect(directive.overlayRef.hasAttached()).toBe(false);
			expect(directive.hide).toHaveBeenCalledOnce();
		});
	});
});
