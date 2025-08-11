import baseConfig from '../../eslint.config.mjs';

export default [
	...baseConfig,
	{
		ignores: ['!**/*', '**/generated/*'],
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: [],

					depConstraints: [
						{
							sourceTag: 'scope:lib-auth',
							onlyDependOnLibsWithTags: [
								'scope:lib-config',
								'scope:lib-prisma',
								'scope:lib-shared'
							]
						},
					],
				},
			],
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {},
	},
];
