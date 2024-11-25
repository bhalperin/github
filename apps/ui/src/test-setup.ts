// import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless/index.mjs';
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless/index.js';

setupZonelessTestEnv({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
});
