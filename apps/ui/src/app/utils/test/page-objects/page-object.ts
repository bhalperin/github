import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export abstract class PageObject<ComponentType> {
	constructor(protected fixture: ComponentFixture<ComponentType>) {}

	detectChanges(): void {
		this.fixture.detectChanges();
	}

	getDebugElementsByCss(cssSelector: string): DebugElement[] {
		return this.fixture.debugElement.queryAll(By.css(cssSelector));
	}

	getDebugElementByCss(cssSelector: string): DebugElement {
		const debugElement = this.fixture.debugElement.query(By.css(cssSelector));

		try {
			expect(debugElement).toBeTruthy();
		} catch {
			throw new Error(`Element with selector "${cssSelector}" was not found.`);
		}

		return debugElement;
	}

	getDebugElementByTestId(testId: string): DebugElement {
		return this.getDebugElementByCss(`[data-test-id="${testId}"]`);
	}
}
