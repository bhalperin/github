import { Module } from '@nestjs/common';
import { PrismaService } from 'api-prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	providers: [UsersService, PrismaService],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
