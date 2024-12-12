import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
	const documentConfig = new DocumentBuilder()
		.setTitle('Nestjs Github Project')
		.setDescription('API description')
		.setVersion('1.0')
		.addTag('nestjs/github')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, documentConfig);

	SwaggerModule.setup('api/doc', app, documentFactory);
};
