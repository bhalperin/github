import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export abstract class PageObject<ComponentType> {
	constructor(protected fixture: ComponentFixture<ComponentType>) {}

	detectChanges(): void {
		this.fixture.detectChanges();
	}

	getDebugElementsByCss(cssSelector: string) {
		return this.fixture.debugElement.queryAll(By.css(cssSelector));
	}

	getDebugElementByCss(cssSelector: string) {
		return this.fixture.debugElement.query(By.css(cssSelector));
	}

	getDebugElementByTestId(testId: string) {
		return this.getDebugElementByCss(`[data-test-id="${testId}"]`);
	}
}
