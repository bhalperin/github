/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as functions from 'firebase-functions';
import { GithubModule } from './modules/github/github.module';

const server = express();

async function bootstrap() {
	const app = await NestFactory.create(GithubModule, new ExpressAdapter(server), { cors: true });
	const globalPrefix = 'api';
	const port = process.env.PORT || 3000;
	const documentConfig = new DocumentBuilder()
		.setTitle('Nestjs Github Project')
		.setDescription('API description')
		.setVersion('1.0')
		.addTag('nestjs/github')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, documentConfig);

	app.setGlobalPrefix(globalPrefix);
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	SwaggerModule.setup('api/doc', app, documentFactory);
	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();

export const api = functions.https.onRequest(server);
