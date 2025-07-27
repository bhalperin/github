import { PrismaService } from '@gh/prisma';
import { UsersService } from '@gh/users';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
	providers: [UsersService, PrismaService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
