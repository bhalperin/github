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
	const httpHost = process.env.HOST || 'localhost';
	const httpPort = process.env.PORT || 3002;
	const app = await NestFactory.create(UsersModule);

	app.connectMicroservice<AsyncMicroserviceOptions>({
		useFactory: (configService: ConfigService) => {
			const tcpHost = configService.get<string>('USERS_MICROSERVICE_HOST') ?? 'localhost';
			const tcpPort = configService.get<number>('USERS_MICROSERVICE_PORT') ?? 3001;

			return {
				transport: Transport.TCP,
				options: {
					host: tcpHost,
					port: tcpPort,
				},
			};
		},
		inject: [ConfigService],
	});
	await app.startAllMicroservices();
	await app.listen(httpPort, httpHost, () => Logger.log(`🚀 Users microservice is running on: http://${httpHost}:${httpPort}`));
}

bootstrap();
