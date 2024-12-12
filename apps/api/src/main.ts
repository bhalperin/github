/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as functions from 'firebase-functions';
import { GithubModule } from './modules/github/github.module';
import { setupAxios } from './setup/axios';
import { setupSwagger } from './setup/swagger';

const server = express();

async function bootstrap() {
	const app = await NestFactory.create(GithubModule, new ExpressAdapter(server), { cors: true });
	const globalPrefix = 'api';
	const port = process.env.PORT || 3000;

	app.setGlobalPrefix(globalPrefix);
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	// set up other services and tools running together with the app
	setupSwagger(app);
	setupAxios();

	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

// Firebase integration
export const api = functions.https.onRequest(server);
