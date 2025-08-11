import { AuthModule as LibAuthModule } from '@gh/auth';
import { PrismaModule } from '@gh/prisma';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
	imports: [LibAuthModule, PrismaModule],
	controllers: [AuthController],
})
export class AuthModule {}
