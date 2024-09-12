import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { globalConfig } from './../config/config';
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
	],
	controllers: [GithubController, AuthController],
	providers: [GithubService],
})
export class GithubModule {}
