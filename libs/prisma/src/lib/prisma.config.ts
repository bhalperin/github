import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	// the main entry for your schema
	schema: 'schema.prisma',
	// where migrations should be generated
	// what script to run for "prisma db seed"
	migrations: {
		path: 'migrations',
		seed: 'tsx prisma/seed.ts',
	},
});
