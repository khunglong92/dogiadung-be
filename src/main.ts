import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration for frontend -> API calls
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins.length
      ? allowedOrigins
      : [
          'http://localhost:7000',
          'http://127.0.0.1:7000',
          'http://localhost:5173',
          'http://127.0.0.1:5173',
        ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Do Gia Dung API')
    .setDescription('API documentation for Do Gia Dung application')
    .setVersion('1.0')
    .addBearerAuth()
    // Explicit servers to avoid Swagger UI resolving paths relative to /api
    .addServer('/')
    .addServer(`http://localhost:${process.env.PORT ?? 8080}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api`,
  );
}

bootstrap();
