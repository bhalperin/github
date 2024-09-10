/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { GithubModule } from './github/github.module';

async function bootstrap() {
	process.loadEnvFile(process.env['environment'] === 'prod' ? './.env' : './apps/api/src/.env');

	const app = await NestFactory.create(GithubModule, { cors: true });
	const globalPrefix = 'api';
	const port = process.env.PORT || 3000;

	app.setGlobalPrefix(globalPrefix);
	app.use(cookieParser());
	await app.listen(port);
	Logger.log(
		`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
	);
}

bootstrap();
