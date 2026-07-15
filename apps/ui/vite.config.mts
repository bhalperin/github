/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/apps/ui',
	plugins: [angular()],
	resolve: {
		tsconfigPaths: true,
	},
	publicDir: 'public',
	test: {
		name: 'ui',
		watch: false,
		globals: true,
		environment: 'jsdom',
		restoreMocks: true,
		include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		setupFiles: ['./src/test-setup.ts'],
		reporters: ['default'],
		includeTaskLocation: true,
		coverage: {
			reportsDirectory: '../../coverage/apps/ui',
			provider: 'v8' as const,
		},
		browser: {
			enabled: true,
			provider: playwright(),
			headless: false,
			instances: [
				{
					browser: 'chromium',
					viewport: { width: 1920, height: 1080 },
				},
			],
		},
	},
}));
