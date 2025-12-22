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

			Logger.log(`🚀 Users microservice will be listening on TCP ${tcpHost}:${tcpPort}`);

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
	Logger.log('🚀 Users microservice is listening on TCP');
	await app.listen(httpPort, () => Logger.log(`🚀 Users microservice is running on: ${httpHost}:${httpPort}`));
}

bootstrap();
