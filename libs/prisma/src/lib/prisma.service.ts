import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	protected connected = false;

	get isConnected() {
		return this.connected;
	}

	async onModuleInit() {
		await this.connect();
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
}
