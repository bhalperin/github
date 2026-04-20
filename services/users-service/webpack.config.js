const { composePlugins, withNx } = require('@nx/webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

// Nx plugins for webpack.
module.exports = composePlugins(
	withNx({
		target: 'node',
	}),
	(config) => {
		// Update the webpack config as needed here.
		// e.g. `config.plugins.push(new MyPlugin())`
		config.resolve.plugins = [
			...(config.resolve.plugins || []),
			new TsconfigPathsPlugin({
				configFile: path.resolve(__dirname, '../../tsconfig.base.json'),
				extensions: ['.ts', '.js'],
			}),
		];

		return config;
	},
);
