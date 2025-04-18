import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nx from '@nx/eslint-plugin';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/node_modules'],
	},
	{
		plugins: {
			'@nx': nx,
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
							onlyDependOnLibsWithTags: ['scope:lib-shared'],
						},
					],
				},
			],
		},
	},
	...compat.extends('plugin:@nx/typescript').map((config) => ({
		...config,
		files: ['**/*.ts', '**/*.tsx'],
	})),
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {},
	},
	...compat.extends('plugin:@nx/javascript').map((config) => ({
		...config,
		files: ['**/*.js', '**/*.jsx'],
	})),
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],

		languageOptions: {
			globals: {
				...globals.jest,
			},
		},

		rules: {},
	},
];
