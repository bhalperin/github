import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule,
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
