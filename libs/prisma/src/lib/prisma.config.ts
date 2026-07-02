import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	// the main entry for your schema
	schema: 'schema.prisma',
	// where migrations should be generated
	// what script to run for "prisma db seed"
	migrations: {
		path: 'migrations',
		seed: 'tsx prisma/seed.ts',
	},
	datasource: {
		url: env('DATABASE_URL') ?? env('DIRECT_URL'),
	},
});
