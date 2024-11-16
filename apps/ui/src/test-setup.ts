// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/index.mjs';

setupZoneTestEnv({
	testEnvironmentOptions: {
		errorOnUnknownElements: true,
		errorOnUnknownProperties: true,
	},
});
