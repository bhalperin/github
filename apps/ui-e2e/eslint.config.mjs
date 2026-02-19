import playwrightPlugin from 'eslint-plugin-playwright';
import baseConfig from '../../eslint.config.mjs';

export default [
	...baseConfig,
	{
		ignores: ['!**/*'],
	},
	{
		plugins: {
			playwright: playwrightPlugin,
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'playwright/no-wait-for-timeout': 'warn',
		},
	},
];
