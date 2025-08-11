/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';

async function bootstrap() {
	let host: string;
	let port: number;
	const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(UsersModule, {
		useFactory: (configService: ConfigService) => {
			host = configService.get<string>('USERS_MICROSERVICE_HOST') ?? 'localhost';
			port = configService.get<number>('USERS_MICROSERVICE_PORT') ?? 3001;

			return {
				transport: Transport.TCP,
				options: {
					host,
					port,
				},
			};
		},
		inject: [ConfigService],
	});

	await app.listen();
	Logger.log('🚀 Users microservice is running');
}

bootstrap();
