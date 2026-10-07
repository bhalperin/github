import { locators } from 'vitest/browser';

locators.extend({
	getByCss: (selector: string) => selector,
});
