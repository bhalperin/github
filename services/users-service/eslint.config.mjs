import baseConfig from '../../eslint.config.mjs';

export default [
	...baseConfig,
	{
		ignores: ['!**/*', '**/generated/*'],
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
							sourceTag: 'scope:microservice-users',
							onlyDependOnLibsWithTags: ['scope:lib-shared', 'scope:lib-config', 'scope:lib-prisma'],
						},
					],
				},
			],
		},
	},
];
