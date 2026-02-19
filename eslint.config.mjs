import js from '@eslint/js';
import nx from '@nx/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
	{
		ignores: ['**/node_modules', '**/dist', '**/coverage'],
	},
	js.configs.recommended,
	{
		plugins: {
			'@nx': nx,
			'@typescript-eslint': tsPlugin,
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: [],
					depConstraints: [
						{
							sourceTag: 'scope:app',
							onlyDependOnLibsWithTags: ['scope:lib-shared', 'scope:lib-config', 'scope:lib-auth', 'scope:lib-prisma', 'scope:lib-users'],
						},
					],
				},
			],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
				},
			],
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			sourceType: 'module',
			ecmaVersion: 'latest',
		},
	},
	{
		files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.jest,
			},
		},
		rules: {},
	},
];
