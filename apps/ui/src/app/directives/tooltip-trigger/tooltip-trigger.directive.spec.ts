import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Locator, page } from '@vitest/browser/context';
import { testSetup } from 'utils/test/setup';
import { describe, expect, test, vi } from 'vitest';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';

@Component({
	selector: 'gh-loader-test',
	imports: [TooltipTriggerDirective],
	template: `<span ghTooltipTrigger data-bs-title="I have a tooltip">Hover me</span>`,
})
class TooltipTriggerTestComponent {}

vi.mock('Tooltip', () => ({
	constructor() {},
}));

describe('TooltipTriggerDirective', () => {
	const setup = () => {
		const { fixture, component } = testSetup(TooltipTriggerTestComponent);

		return { fixture, component };
	};
	let withTooltip: Locator;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TooltipTriggerTestComponent],
		}).compileComponents();
		setup();

		withTooltip = page.getByText('Hover me');
	});

	test('tooltip should not show before hover', async () => {
		const tooltip = page.getByRole('tooltip');

		await expect(tooltip).toHaveLength(0);
	});

	test('tooltip should show on hover and hide on unhover', async () => {
		const tooltip = page.getByRole('tooltip');

		await withTooltip.hover(); // Move mouse away to trigger tooltip show

		await expect(tooltip).toBeVisible();
		await expect(tooltip).toHaveTextContent('I have a tooltip');

		await withTooltip.unhover(); // Move mouse away to trigger tooltip hide

		await expect(tooltip.elements).toHaveLength(0);
	});
});
