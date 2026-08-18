import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Locator, page } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { testSetup } from 'core/utils/test/setup';

import { TooltipTriggerDirective } from './tooltip-trigger.directive';

@Component({
	selector: 'gh-tooltip-trigger-test',
	imports: [TooltipTriggerDirective],
	template: `<span ghTooltipTrigger data-bs-title="I have a tooltip">Hover me</span>`,
})
class TooltipTriggerTestComponent {}

vi.mock('Tooltip', () => ({
	constructor() {},
}));

describe('TooltipTriggerDirective', () => {
	let tooltip: Locator;
	let elementWithTooltip: Locator;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TooltipTriggerTestComponent],
		}).compileComponents();
		testSetup(TooltipTriggerTestComponent);

		tooltip = page.getByRole('tooltip');
		elementWithTooltip = page.getByText('Hover me');
	});

	test('tooltip should not show before hover', async () => {
		await expect.element(tooltip).toHaveLength(0);
	});

	test('tooltip should show on hover and hide on unhover', async () => {
		await elementWithTooltip.hover(); // Move mouse away to trigger tooltip show

		await expect(tooltip).toBeVisible();
		await expect(tooltip).toHaveTextContent('I have a tooltip');

		await elementWithTooltip.unhover(); // Move mouse away to trigger tooltip hide

		await expect.element(tooltip).toHaveLength(0);
	});
});
