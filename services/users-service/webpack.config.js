const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
	target: 'node',
	output: {
		path: join(__dirname, '../../dist/services/users-service'),
		filename: 'main.js',
	},
	plugins: [
		new NxAppWebpackPlugin({
			target: 'node',
			compiler: 'tsc',
			main: './src/main.ts',
			tsConfig: './tsconfig.app.json',
			assets: ['./src/assets'],
			optimization: false,
			outputHashing: 'none',
			// Registers the NestJS Swagger AST transformer
			transformers: [
				{
					name: '@nestjs/swagger/plugin',
					options: {
						dtoFileNameSuffix: ['.dto.ts', '.entity.ts'], // Adjust extensions as needed
					},
				},
			],
		}),
	],
};
