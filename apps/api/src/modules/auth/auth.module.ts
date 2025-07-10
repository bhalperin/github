import { AuthService, GoogleStrategy, JwtStrategy, LocalStrategy } from '@gh/auth';
import { PrismaService } from '@gh/prisma';
import { UsersService } from '@gh/users';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		PassportModule,
		JwtModule,
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, PrismaService, UsersService],
	controllers: [AuthController],
})
export class AuthModule {}
