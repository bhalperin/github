import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { globalConfig } from '../../config/config';
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
	providers: [GithubService],
	controllers: [GithubController],
})
export class GithubModule {}
