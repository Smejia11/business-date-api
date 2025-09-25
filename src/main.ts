import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import pinoHttp from 'pino-http';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());
  app.use(pinoHttp({ level: 'info' }));
  const config = new DocumentBuilder()
    .setTitle('Business Date API')
    .setDescription('API to calculate business dates in Colombia')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app
    .getHttpAdapter()
    .get('/', (_req: Request, res: Response) => res.redirect('/api/docs'));

  SwaggerModule.setup('api/docs', app, document); // URL: /api/docs
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
