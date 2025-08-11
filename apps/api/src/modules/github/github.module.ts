import { globalConfig } from '@gh/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
	imports: [
		HttpModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [globalConfig],
		}),
		AuthModule,
		UsersModule,
	],
	providers: [GithubService],
	controllers: [GithubController],
})
export class GithubModule {}
