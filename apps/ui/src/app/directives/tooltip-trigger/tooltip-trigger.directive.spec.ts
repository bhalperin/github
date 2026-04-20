import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as bootstrap from 'bootstrap';
import { testSetup } from 'utils/test/setup';
import { describe, expect, test, vi } from 'vitest';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';

@Component({
	selector: 'gh-loader-test',
	imports: [TooltipTriggerDirective],
	template: `<div ghTooltipTrigger></div>`,
})
class TooltipTriggerTestComponent {}

vi.mock('bootstrap', () => ({
	Tooltip: vi.fn(),
}));

describe('TooltipTriggerDirective', () => {
	const setup = () => {
		const { fixture, component } = testSetup(TooltipTriggerTestComponent);

		return { fixture, component };
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TooltipTriggerTestComponent],
		}).compileComponents();
	});

	test('should create an instance', async () => {
		let fixture: ComponentFixture<TooltipTriggerTestComponent>;

		fixture = setup().fixture;
		await fixture.whenStable();

		expect(bootstrap.Tooltip).toHaveBeenCalledTimes(1);
		expect(bootstrap.Tooltip).toHaveBeenCalledWith(expect.any(HTMLElement), { trigger: 'hover' });
	});
});
