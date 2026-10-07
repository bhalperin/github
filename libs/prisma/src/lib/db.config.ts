import { env } from 'prisma/config';

//  Defining a clean interface decoupled from the 'pg' package version structure
interface DatabaseConfig {
	connectionString: string | undefined;
	ssl?: { rejectUnauthorized: boolean } | undefined;
}
export function getDbConfig() {
	const connectionString = env('DATABASE_URL') ?? env('DIRECT_URL');

	return {
		connectionString,
		ssl: connectionString?.includes('supabase') ? { rejectUnauthorized: false } : undefined,
	} as DatabaseConfig;
}

export const dbConfig = getDbConfig();
