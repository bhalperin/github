/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as functions from 'firebase-functions';
import { ZodValidationPipe } from 'nestjs-zod';

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
	app.useGlobalPipes(new ZodValidationPipe());

	// set up other services and tools running together with the app
	setupSwagger(app);
	setupAxios();

	return { app, port, globalPrefix };
}

bootstrap()
	.then(async ({ app, port, globalPrefix }) => {
		await app.listen(port, () => Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`));
	})
	.catch((error) => {
		Logger.error('Error starting the application', error);
	});

// Firebase integration
export const api = functions.https.onRequest(server);
