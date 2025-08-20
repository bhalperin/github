const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(
	withNx({
		target: 'node',
		additionalEntryPoints: [
			{
				entryName: 'server',
				entryPath: 'apps/api/src/server.ts',
			},
		],
	}),
	(config) => {
		// Update the webpack config as needed here.
		// e.g. `config.plugins.push(new MyPlugin())`
		config.output = {
			...config.output,
			libraryTarget: 'commonjs2',
		};

		return config;
	},
);
