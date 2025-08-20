/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import { GithubModule } from './modules/github/github.module';
import { setupAxios } from './setup/axios';
import { setupSwagger } from './setup/swagger';

const server = express();
let cachedServer: any

async function bootstrap() {
	const adapter = new ExpressAdapter(server);

	adapter.post('/test', (req, res) => {
		res.json({ message: 'Test route works!' });
	});

	const app = await NestFactory.create(GithubModule, adapter, { cors: true });
	const globalPrefix = 'api';

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

	await app.init();

	return app.getHttpAdapter().getInstance();
}

export default async function apiHandler(req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) {
	try {
		if (!cachedServer) {
			cachedServer = await bootstrap();
		}

		return cachedServer(req, res);
	} catch (error) {
		Logger.error('Error handling the request', error);
		res.status(500).send('Internal Server Error');
	}
}
