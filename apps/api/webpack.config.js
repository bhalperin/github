const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
	target: 'node',
	entry: {
		// Replaces the old 'additionalEntryPoints' array
		server: './src/server.ts',
	},
	output: {
		path: join(__dirname, '../../dist/apps/api'),
		filename: '[name].js', // Necessary to prevent entry points from overwriting each other
		libraryTarget: 'commonjs2', // Preserves your custom libraryTarget override
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
		}),
	],
};
