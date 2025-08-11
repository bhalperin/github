import { MICROSERVICE_NAME_USERS } from '@gh/shared/utils';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
	imports: [JwtModule,
		ClientsModule.registerAsync([
			{
				name: MICROSERVICE_NAME_USERS,
				imports: [ConfigModule],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get<string>('USERS_MICROSERVICE_HOST') ?? 'localhost',
						port: configService.get<number>('USERS_MICROSERVICE_PORT') ?? 3001,
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
