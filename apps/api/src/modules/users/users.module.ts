import { MICROSERVICE_NAME_USERS } from '@gh/shared/utils';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: MICROSERVICE_NAME_USERS,
				imports: [ConfigModule],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get<string>('USERS_MICROSERVICE_HOST') ?? 'localhost',
						port: configService.get<number>('USERS_MICROSERVICE_PORT') ?? 3002,
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
	controllers: [UsersController],
})
export class UsersModule {}
