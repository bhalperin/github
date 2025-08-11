import { PrismaModule } from '@gh/prisma';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
	imports: [PrismaModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
