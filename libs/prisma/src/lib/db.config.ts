import { PoolConfig } from 'pg';
import { env } from 'prisma/config';

export function getDbConfig() {
	const connectionString = env('DATABASE_URL') ?? env('DIRECT_URL');

	return {
		connectionString,
		ssl: connectionString?.includes('supabase') ? { rejectUnauthorized: false } : undefined,
	} as PoolConfig;
}

export const dbConfig = getDbConfig();
