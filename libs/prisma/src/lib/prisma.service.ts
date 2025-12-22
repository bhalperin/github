import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../../generated/prisma/client/client';
import { dbConfig } from './db.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	protected connected = false;

	constructor() {
		const pool = new pg.Pool(dbConfig);
		const adapter = new PrismaPg(pool);

		super({ adapter });
	}

	get isConnected() {
		return this.connected;
	}

	async connect() {
		try {
			await this.$connect();
			this.connected = true;
			console.log('PrismaService initialized and connected to the database');
		} catch (error) {
			console.error('PrismaService database connection error:', error);
		}
	}

	async onModuleInit() {
		await this.connect();
	}

	async onModuleDestroy() {
		await this.connect();
	}
}
