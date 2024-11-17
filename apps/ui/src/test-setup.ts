// import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless/index.mjs';
const setupZonelessTestEnv = require('jest-preset-angular/setup-env/zoneless/index.js').setupZonelessTestEnv;

setupZonelessTestEnv({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
});
