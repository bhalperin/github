import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule as LibAuthModule } from '@gh/auth';
import { PrismaModule } from '@gh/prisma';

import { AuthController } from './auth.controller';

@Module({
	imports: [PassportModule.register({}), LibAuthModule, PrismaModule],
	controllers: [AuthController],
})
export class AuthModule {}
