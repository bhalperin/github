import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
	imports: [HttpModule, AuthModule],
	controllers: [GithubController, AuthController],
	providers: [GithubService],
})
export class GithubModule {}
