import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import templateParser from '@angular-eslint/template-parser';
import baseConfig from '../../eslint.config.mjs';

export default [
	...baseConfig,
	{
		ignores: ['!**/*'],
	},
	{
		plugins: {
			'@angular-eslint': angularPlugin,
			'@angular-eslint/template': angularTemplatePlugin,
		},
	},
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'gh',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'gh',
					style: 'kebab-case',
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		languageOptions: {
			parser: templateParser,
		},
		rules: {},
	},
];
