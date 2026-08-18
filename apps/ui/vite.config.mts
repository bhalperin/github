/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { join, relative, resolve } from 'path';
import { defineConfig } from 'vite';

const workspaceRoot = resolve(import.meta.dirname, '../../');
const projectRelativePath = relative(workspaceRoot, import.meta.dirname);

export default defineConfig(() => ({
	root: import.meta.dirname,
	cacheDir: join(import.meta.dirname, '../../node_modules/.vite/apps/ui'),
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
		setupFiles: [join(import.meta.dirname, 'src/test-setup.ts'), join(import.meta.dirname, 'src/vitest.setup.browser.ts')],
		reporters: ['default'],
		includeTaskLocation: true,
		coverage: {
			reportsDirectory: join(workspaceRoot, 'coverage', projectRelativePath),
			provider: 'v8' as const,
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{html,ts}'],
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
