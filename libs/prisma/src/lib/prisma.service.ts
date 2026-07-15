import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client/client';
import { getDbConfig } from './db.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	protected connected = false;

	constructor() {
		const dbConfig = getDbConfig();
		console.log('Initializing PrismaService...\n', JSON.stringify(dbConfig));
		const adapter = new PrismaPg(dbConfig);

		super({ adapter });
	}

	get isConnected() {
		return this.connected;
	}

	async connect() {
		try {
			await this.$connect();
			await this.$executeRaw`SELECT 1`; // Test the connection
			this.connected = true;
			console.log('PrismaService initialized and connected to the database');
		} catch (error) {
			this.connected = false;
			console.error('PrismaService database connection error:', error);
			throw error;
		}
	}

	async onModuleInit() {
		await this.connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
