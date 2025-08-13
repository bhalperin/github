import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client/client';

@Injectable()
export class PrismaService implements OnModuleInit {
	readonly client: PrismaClient;
	protected connected = false;

	constructor() {
		this.client = new PrismaClient();
	}

	get isConnected() {
		return this.connected;
	}

	async onModuleInit() {
		await this.connect();
	}

	async connect() {
		try {
			await this.client.$connect();
			this.connected = true;
			console.log('PrismaService initialized and connected to the database');
		} catch (error) {
			console.error('PrismaService database connection error:', error);
		}
	}
}
