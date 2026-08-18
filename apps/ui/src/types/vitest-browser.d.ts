import { Locator } from 'vitest/browser';

declare module 'vitest/browser' {
	interface LocatorSelectors {
		getByCss(selector: string): Locator;
	}
}
